import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
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
    @InjectRepository(Battle) private battleRepo: Repository<Battle>,
    @InjectRepository(Player) private playerRepo: Repository<Player>,
    @InjectRepository(Unit) private unitRepo: Repository<Unit>,
    @InjectRepository(BattleLog) private battleLogRepo: Repository<BattleLog>,
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

    console.log('>>>>> CREATED BATTLE:', savedBattle.id);
    return savedBattle;
  }

  async createBattleStacks(battle: Battle): Promise<void> {
    const [playerOneUnits, playerTwoUnits] = await Promise.all([
      this.unitRepo.find({ where: { playerId: battle.playerOne.id } }),
      this.unitRepo.find({ where: { playerId: battle.playerTwo.id } }),
    ]);

    const units: BattleUnit[] = [];

    for (const unit of playerOneUnits.concat(playerTwoUnits)) {
      const owner =
        unit.playerId === battle.playerOne.id
          ? battle.playerOne
          : battle.playerTwo;
      units.push(
        this.battleUnitRepo.create({
          battle,
          owner,
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
    console.log('⚔️ [Service] chooseUnit() called with:', {
      playerId,
      battleId,
      unitId,
    });

    const battle = await this.findOne(battleId);
    const player = [battle.playerOne, battle.playerTwo].find(
      (p) => p.id === playerId,
    );
    if (!player) throw new BadRequestException('Игрок не участвует в этом бою');

    const unit = await this.battleUnitRepo.findOne({
      where: {
        id: unitId,
        battle: { id: battleId },
        owner: { id: playerId },
      },
      relations: ['owner', 'originalUnit'],
    });

    if (!unit || unit.remaining <= 0) {
      throw new BadRequestException('Юнит не найден или израсходован');
    }

    if (battle.playerOne.id === playerId) {
      battle.attackerSelectedUnit = unit;
    } else {
      battle.defenderSelectedUnit = unit;
    }

    await this.battleRepo.save(battle);
    console.log(`✅ Unit selected: ${unit.id} by ${player.username}`);

    const bot = battle.playerOne.isBot
      ? battle.playerOne
      : battle.playerTwo.isBot
        ? battle.playerTwo
        : null;

    if (bot) {
      console.log('🤖 Бот участвует в бою, проверяем его выбор...');
      const botUnit = await this.battleUnitRepo.findOne({
        where: {
          battle: { id: battle.id },
          owner: { id: bot.id },
          remaining: MoreThan(0),
        },
        order: { remaining: 'DESC' },
        relations: ['originalUnit', 'owner'],
      });

      if (botUnit) {
        if (bot.id === battle.playerOne.id) {
          battle.attackerSelectedUnit = botUnit;
        } else {
          battle.defenderSelectedUnit = botUnit;
        }
        await this.battleRepo.save(battle);
        console.log(
          `🤖 Бот выбрал юнита: ${botUnit.id} (${botUnit.originalUnit.type})`,
        );
      } else {
        console.warn('❌ Бот не имеет доступных юнитов');
      }
    }

    return this.findOne(battleId);
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

    const log = this.battleLogRepo.create({
      battle,
      turnNumber: battle.currentTurn,
      attacker,
      defender,
      attackerUnitId: attackerUnit.originalUnit.id,
      defenderUnitId: defenderUnit.originalUnit.id,
    });

    const critA = Math.random() < calculateCritChance(attacker) / 100;
    const critD = Math.random() < calculateCritChance(defender) / 100;
    const dodgeA = Math.random() < calculateDodgeChance(attacker) / 100;
    const dodgeD = Math.random() < calculateDodgeChance(defender) / 100;

    const dmgA =
      calculateDamage(attacker, defender, attackerUnit.originalUnit) +
      (critA ? 5 : 0);
    const dmgD =
      calculateDamage(defender, attacker, defenderUnit.originalUnit) +
      (critD ? 5 : 0);

    log.attackerCrit = critA;
    log.defenderCrit = critD;
    log.attackerDodged = dodgeA;
    log.defenderDodged = dodgeD;

    if (!dodgeD) {
      defender.health -= dmgA;
      log.damageDealtToDefender = dmgA;
    }

    if (!dodgeA) {
      attacker.health -= dmgD;
      log.damageDealtToAttacker = dmgD;
    }

    attackerUnit.remaining -= 1;
    defenderUnit.remaining -= 1;

    battle.currentTurn++;
    battle.turnStartedAt = new Date();
    battle.attackerSelectedUnit = null;
    battle.defenderSelectedUnit = null;

    await Promise.all([
      this.battleLogRepo.save(log),
      this.battleUnitRepo.update(attackerUnit.id, {
        remaining: attackerUnit.remaining,
      }),
      this.battleUnitRepo.update(defenderUnit.id, {
        remaining: defenderUnit.remaining,
      }),
      this.playerRepo.save([attacker, defender]),
    ]);

    const attackerDead = attacker.health <= 0;
    const defenderDead = defender.health <= 0;

    if (attackerDead || defenderDead) {
      const winner = attackerDead ? defender : attacker;
      winner.experience += 10;
      winner.gold += 20;

      battle.isFinished = true;
      battle.winner = winner;
      battle.playerOne.currentBattleId = null;
      battle.playerTwo.currentBattleId = null;
      battle.playerOne.lastBattleEndedAt = new Date();
      battle.playerTwo.lastBattleEndedAt = new Date();

      await this.playerRepo.save([battle.playerOne, battle.playerTwo, winner]);
    }

    await this.battleRepo.save(battle);
    return { battle: await this.findOne(battleId) };
  }

  async findOne(id: string): Promise<Battle> {
    const battle = await this.battleRepo.findOne({
      where: { id },
      relations: [
        'playerOne',
        'playerTwo',
        'winner',
        'attackerSelectedUnit',
        'attackerSelectedUnit.originalUnit',
        'defenderSelectedUnit',
        'defenderSelectedUnit.originalUnit',
      ],
    });

    if (!battle) throw new NotFoundException(`Battle ${id} not found`);

    const allUnits = await this.battleUnitRepo.find({
      where: { battle: { id } },
      relations: ['originalUnit', 'owner'],
    });

    (battle.playerOne as any).units = allUnits.filter(
      (u) => u.owner.id === battle.playerOne.id,
    );
    (battle.playerTwo as any).units = allUnits.filter(
      (u) => u.owner.id === battle.playerTwo.id,
    );

    return battle;
  }

  async getCurrentBattle(playerId: string): Promise<Battle | null> {
    const player = await this.playerRepo.findOneBy({ id: playerId });
    return player?.currentBattleId
      ? this.findOne(player.currentBattleId)
      : null;
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
      username: 'BOT_' + Math.random().toString(36).slice(2, 8),
      isBot: true,
      level: player.level,
      health: player.health,
      gold: 0,
      experience: 0,
      strength: 5,
      agility: 5,
      defense: 5,
      password: '123123',
      authId: 'bot-auth-' + Math.random().toString(36).slice(2, 8),
    });
    await this.playerRepo.save(bot);

    const baseUnits = [
      UnitType.INFANTRY,
      UnitType.ARCHER,
      UnitType.CAVALRY,
    ].map((type) =>
      this.unitRepo.create({
        type,
        level: 1,
        amount: 99,
        baseDamage: 5,
        playerId: bot.id,
      }),
    );
    await this.unitRepo.save(baseUnits);

    const battle = this.battleRepo.create({
      playerOne: player,
      playerTwo: bot,
      currentTurn: 1,
      turnStartedAt: new Date(),
    });
    const saved = await this.battleRepo.save(battle);
    await this.createBattleStacks(saved);

    player.currentBattleId = saved.id;
    await this.playerRepo.save(player);

    console.log('>>>>> Created bot battle:', saved.id);
    return saved;
  }

  async leaveBattle(playerId: string): Promise<void> {
    const player = await this.playerRepo.findOne({ where: { id: playerId } });
    if (!player?.currentBattleId) return;

    const battle = await this.battleRepo.findOneBy({
      id: player.currentBattleId,
    });
    player.currentBattleId = null;

    await this.playerRepo.save(player);

    if (battle?.isFinished) {
      await this.battleUnitRepo.delete({ battle: { id: battle.id } });
    }
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
