import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from './entities/battle.entity';
import { CreateBattleDto } from './dto/create-battle.dto';
import { Player } from 'src/player/entities/player.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { UnitType } from 'src/unit/unit-type.enum';
import { PlayerService } from 'src/player/player.service';
import {
  calculateCritChance,
  calculateDamage,
  calculateDodgeChance,
} from 'src/combat/combat-formulas';
import { BattleLog } from './entities/battle-log.entity';
import { BattleUnit } from './entities/battle-unit.entity';

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(Battle)
    private battleRepo: Repository<Battle>,

    @InjectRepository(Player)
    private playerRepo: Repository<Player>,

    @InjectRepository(Unit)
    private unitRepo: Repository<Unit>,

    @InjectRepository(BattleLog)
    private battleLogRepo: Repository<BattleLog>,

    @InjectRepository(BattleUnit)
    private battleUnitRepo: Repository<BattleUnit>,

    private playerService: PlayerService,
  ) {}

  async create(dto: CreateBattleDto, playerOneId: string): Promise<Battle> {
    const playerOne = await this.playerRepo.findOneByOrFail({
      id: playerOneId,
    });
    const playerTwo = await this.playerRepo.findOneByOrFail({
      id: dto.playerTwoId,
    });

    const battle = this.battleRepo.create({
      playerOne,
      playerTwo,
      currentTurn: 1,
      turnStartedAt: new Date(),
    });

    const savedBattle = await this.battleRepo.save(battle);
    await this.createBattleStacks(savedBattle);

    playerOne.currentBattleId = savedBattle.id;
    playerTwo.currentBattleId = savedBattle.id;
    await this.playerRepo.save([playerOne, playerTwo]);

    return savedBattle;
  }

  async createBattleStacks(battle: Battle): Promise<void> {
    const [playerOneUnits, playerTwoUnits] = await Promise.all([
      this.unitRepo.find({ where: { playerId: battle.playerOne.id } }),
      this.unitRepo.find({ where: { playerId: battle.playerTwo.id } }),
    ]);

    const units: BattleUnit[] = [];

    for (const unit of playerOneUnits) {
      units.push(
        this.battleUnitRepo.create({
          battle,
          owner: battle.playerOne,
          originalUnit: unit,
          remaining: unit.amount,
          level: unit.level,
          baseDamage: unit.baseDamage,
        }),
      );
    }

    for (const unit of playerTwoUnits) {
      units.push(
        this.battleUnitRepo.create({
          battle,
          owner: battle.playerTwo,
          originalUnit: unit,
          remaining: unit.amount,
          level: unit.level,
          baseDamage: unit.baseDamage,
        }),
      );
    }

    await this.battleUnitRepo.save(units);
  }

  async chooseUnit(
    playerId: string,
    battleId: string,
    unitId: string,
  ): Promise<Battle> {
    const battle = await this.findOne(battleId);

    const unit = await this.battleUnitRepo.findOne({
      where: {
        id: unitId,
        battle: { id: battleId },
        owner: { id: playerId },
      },
      relations: ['owner', 'originalUnit'],
    });

    if (!unit) {
      throw new BadRequestException('Юнит не найден или недоступен');
    }

    if (unit.remaining <= 0) {
      throw new BadRequestException('Этот юнит уже израсходован');
    }

    const isPlayerOne = battle.playerOne.id === playerId;

    if (isPlayerOne) {
      battle.attackerSelectedUnit = unit;
    } else {
      battle.defenderSelectedUnit = unit;
    }

    await this.battleRepo.save(battle);
    return this.findOne(battleId);
  }

  compareUnits(
    attacker: UnitType,
    defender: UnitType,
  ): 'attacker' | 'defender' | 'draw' {
    if (attacker === defender) return 'draw';

    if (
      (attacker === UnitType.CAVALRY && defender === UnitType.ARCHER) ||
      (attacker === UnitType.ARCHER && defender === UnitType.INFANTRY) ||
      (attacker === UnitType.INFANTRY && defender === UnitType.CAVALRY)
    ) {
      return 'attacker';
    }

    return 'defender';
  }

  async processBattleTurn(battleId: string): Promise<{ battle: Battle }> {
    const battle = await this.findOne(battleId);

    const attacker = battle.playerOne;
    const defender = battle.playerTwo;

    const attackerUnit = battle.attackerSelectedUnit;
    const defenderUnit = battle.defenderSelectedUnit;

    if (!attackerUnit || !defenderUnit) {
      throw new BadRequestException('Оба игрока не выбрали юниты');
    }

    const log = new BattleLog();
    log.battle = battle;
    log.turnNumber = battle.currentTurn;

    const attackerCritChance = calculateCritChance(attacker) / 100;
    const defenderCritChance = calculateCritChance(defender) / 100;
    const attackerDodgeChance = calculateDodgeChance(attacker) / 100;
    const defenderDodgeChance = calculateDodgeChance(defender) / 100;

    const attackerCrit = Math.random() < attackerCritChance;
    const defenderCrit = Math.random() < defenderCritChance;
    const attackerDodged = Math.random() < attackerDodgeChance;
    const defenderDodged = Math.random() < defenderDodgeChance;

    const attackerBase = calculateDamage(
      attacker,
      defender,
      attackerUnit.originalUnit,
    );
    const defenderBase = calculateDamage(
      defender,
      attacker,
      defenderUnit.originalUnit,
    );

    const attackerDamage = attackerBase + (attackerCrit ? 5 : 0);
    const defenderDamage = defenderBase + (defenderCrit ? 5 : 0);

    let damageDealtToDefender = 0;
    let damageDealtToAttacker = 0;

    if (!defenderDodged) {
      defender.health -= attackerDamage;
      damageDealtToDefender = attackerDamage;
    }

    if (!attackerDodged) {
      attacker.health -= defenderDamage;
      damageDealtToAttacker = defenderDamage;
    }

    attackerUnit.remaining = Math.max(0, attackerUnit.remaining - 1);
    defenderUnit.remaining = Math.max(0, defenderUnit.remaining - 1);

    await this.battleUnitRepo.save([attackerUnit, defenderUnit]);
    await this.playerRepo.save([attacker, defender]);

    log.attacker = attacker;
    log.defender = defender;
    log.attackerUnit = attackerUnit.originalUnit;
    log.defenderUnit = defenderUnit.originalUnit;
    log.attackerCrit = attackerCrit;
    log.defenderCrit = defenderCrit;
    log.attackerDodged = attackerDodged;
    log.defenderDodged = defenderDodged;
    log.damageDealtToAttacker = damageDealtToAttacker;
    log.damageDealtToDefender = damageDealtToDefender;

    await this.battleLogRepo.save(log);

    battle.attackerSelectedUnit = null;
    battle.defenderSelectedUnit = null;
    battle.currentTurn += 1;
    battle.turnStartedAt = new Date();

    const attackerDead = attacker.health <= 0;
    const defenderDead = defender.health <= 0;

    if (attackerDead || defenderDead) {
      battle.isFinished = true;
      battle.winner = attackerDead ? defender : attacker;
      const winner = battle.winner;
      winner.experience += 10;
      winner.gold += 20;
      await this.playerRepo.save(winner);

      await this.battleUnitRepo.delete({ battle: { id: battle.id } });

      battle.playerOne.currentBattleId = null;
      battle.playerTwo.currentBattleId = null;
      battle.playerOne.lastBattleEndedAt = new Date();
      battle.playerTwo.lastBattleEndedAt = new Date();
      await this.playerRepo.save([battle.playerOne, battle.playerTwo]);
    }

    await this.battleRepo.save(battle);
    return { battle };
  }

  async findOne(id: string): Promise<Battle> {
    const battle = await this.battleRepo.findOne({
      where: { id },
      relations: [
        'playerOne',
        'playerTwo',
        'attackerSelectedUnit',
        'attackerSelectedUnit.originalUnit',
        'defenderSelectedUnit',
        'defenderSelectedUnit.originalUnit',
        'winner',
      ],
    });

    if (!battle) throw new NotFoundException(`Battle ${id} not found`);

    const battleUnits = await this.battleUnitRepo.find({
      where: { battle: { id } },
      relations: ['originalUnit', 'owner'],
    });

    (battle.playerOne as any).units = battleUnits.filter(
      (u) => u.owner.id === battle.playerOne.id,
    );

    (battle.playerTwo as any).units = battleUnits.filter(
      (u) => u.owner.id === battle.playerTwo.id,
    );

    return battle;
  }

  async getCurrentBattle(playerId: string): Promise<Battle | null> {
    const player = await this.playerRepo.findOneBy({ id: playerId });
    if (!player?.currentBattleId) return null;
    return this.findOne(player.currentBattleId);
  }

  async getLogsForBattle(battleId: string): Promise<BattleLog[]> {
    return this.battleLogRepo.find({
      where: { battle: { id: battleId } },
      order: { turnNumber: 'ASC' },
    });
  }

  async createBotBattle(playerId: string): Promise<Battle> {
    const player = await this.playerRepo.findOneByOrFail({ id: playerId });

    const bot = this.playerRepo.create({
      username: 'BOT_' + Math.random().toString(36).substring(2, 8),
      isBot: true,
      level: player.level,
      health: player.health,
      gold: 0,
      experience: 0,
      strength: 5,
      agility: 5,
      defense: 5,
      password: '123123123',
      authId: 'bot-auth-' + Math.random().toString(36).substring(2, 8),
    });

    await this.playerRepo.save(bot);

    const battle = this.battleRepo.create({
      playerOne: player,
      playerTwo: bot,
      currentTurn: 1,
      turnStartedAt: new Date(),
    });

    const savedBattle = await this.battleRepo.save(battle);

    await this.createBattleStacks(savedBattle);

    player.currentBattleId = savedBattle.id;
    await this.playerRepo.save(player);

    return savedBattle;
  }

  async leaveBattle(playerId: string): Promise<void> {
    const player = await this.playerRepo.findOneBy({ id: playerId });
    if (!player) return;
    player.currentBattleId = null;
    await this.playerRepo.save(player);
  }

  async remove(id: string): Promise<void> {
    await this.battleRepo.delete(id);
  }

  async findAll(): Promise<Battle[]> {
    return this.battleRepo.find({
      relations: ['playerOne', 'playerTwo', 'winner'],
    });
  }
}
