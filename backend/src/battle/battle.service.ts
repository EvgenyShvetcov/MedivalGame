import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from './entities/battle.entity';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';
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

  async createBattleStacks(battle: Battle) {
    const [unitsP1, unitsP2] = await Promise.all([
      this.unitRepo.find({ where: { owner: { id: battle.playerOne.id } } }),
      this.unitRepo.find({ where: { owner: { id: battle.playerTwo.id } } }),
    ]);

    const stacks: BattleUnit[] = [];

    for (const unit of unitsP1) {
      stacks.push(
        this.battleUnitRepo.create({
          battle,
          originalUnit: unit,
          owner: battle.playerOne,
          remaining: unit.amount,
          level: unit.level,
          baseDamage: unit.baseDamage,
        }),
      );
    }

    for (const unit of unitsP2) {
      stacks.push(
        this.battleUnitRepo.create({
          battle,
          originalUnit: unit,
          owner: battle.playerTwo,
          remaining: unit.amount,
          level: unit.level,
          baseDamage: unit.baseDamage,
        }),
      );
    }

    await this.battleUnitRepo.save(stacks);
  }

  async chooseUnit(
    battleId: string,
    playerId: string,
    unitId: string,
  ): Promise<Battle> {
    const battle = await this.battleRepo.findOne({
      where: { id: battleId },
      relations: ['playerOne', 'playerTwo'],
    });

    if (!battle) throw new NotFoundException('Battle not found');

    const battleUnit = await this.battleUnitRepo.findOne({
      where: { id: unitId },
      relations: ['owner', 'originalUnit'],
    });

    if (!battleUnit) throw new NotFoundException('BattleUnit not found');
    if (battleUnit.remaining <= 0) {
      throw new BadRequestException(
        'Этот юнит больше не может быть использован в бою',
      );
    }

    const isPlayerOne = battle.playerOne.id === playerId;
    const isPlayerTwo = battle.playerTwo.id === playerId;

    if (!isPlayerOne && !isPlayerTwo) {
      throw new UnauthorizedException('Not your battle');
    }

    if (isPlayerOne) {
      battle.attackerSelectedUnit = battleUnit;
    } else {
      battle.defenderSelectedUnit = battleUnit;
    }

    return this.battleRepo.save(battle);
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

  async processBattleTurn(battleId: string) {
    const battle = await this.battleRepo.findOne({
      where: { id: battleId },
      relations: [
        'attackerSelectedUnit',
        'attackerSelectedUnit.originalUnit',
        'defenderSelectedUnit',
        'defenderSelectedUnit.originalUnit',
        'playerOne',
        'playerTwo',
      ],
    });

    if (!battle) throw new NotFoundException('Битва не найдена');
    if (battle.isFinished) throw new BadRequestException('Битва уже завершена');

    const attackerUnit = battle.attackerSelectedUnit;
    const defenderUnit = battle.defenderSelectedUnit;

    if (!attackerUnit || !defenderUnit) {
      throw new BadRequestException('Оба игрока не выбрали юниты');
    }

    const attackerPlayer = await this.playerService.findOne(
      battle.playerOne.id,
    );
    const defenderPlayer = await this.playerService.findOne(
      battle.playerTwo.id,
    );

    const winnerSide = this.compareUnits(
      attackerUnit.originalUnit.type,
      defenderUnit.originalUnit.type,
    );

    const summary = {
      attackerDodge: false,
      defenderDodge: false,
      attackerCrit: false,
      defenderCrit: false,
      attackerDamage: 0,
      defenderDamage: 0,
    };

    if (winnerSide === 'attacker') {
      const dodge = Math.random() * 100 < calculateDodgeChance(defenderPlayer);
      summary.defenderDodge = dodge;

      if (!dodge) {
        let dmg = calculateDamage(
          attackerPlayer,
          defenderPlayer,
          attackerUnit.originalUnit,
        );
        const crit = Math.random() * 100 < calculateCritChance(attackerPlayer);
        summary.attackerCrit = crit;
        if (crit) dmg *= 2;
        summary.attackerDamage = dmg;
        battle.playerTwo.health -= dmg;
        attackerUnit.remaining = Math.max(0, attackerUnit.remaining - 1);
      }
    }

    if (winnerSide === 'defender') {
      const dodge = Math.random() * 100 < calculateDodgeChance(attackerPlayer);
      summary.attackerDodge = dodge;

      if (!dodge) {
        let dmg = calculateDamage(
          defenderPlayer,
          attackerPlayer,
          defenderUnit.originalUnit,
        );
        const crit = Math.random() * 100 < calculateCritChance(defenderPlayer);
        summary.defenderCrit = crit;
        if (crit) dmg *= 2;
        summary.defenderDamage = dmg;
        battle.playerOne.health -= dmg;
        defenderUnit.remaining = Math.max(0, defenderUnit.remaining - 1);
      }
    }

    const now = new Date();
    const isP1Dead = battle.playerOne.health <= 0;
    const isP2Dead = battle.playerTwo.health <= 0;

    if (isP1Dead || isP2Dead) {
      battle.isFinished = true;
      battle.winner = isP1Dead ? battle.playerTwo : battle.playerOne;
      battle.playerOne.currentBattleId = null;
      battle.playerTwo.currentBattleId = null;
      battle.playerOne.lastBattleEndedAt = now;
      battle.playerTwo.lastBattleEndedAt = now;

      const xp =
        50 + Math.max(battle.playerOne.level, battle.playerTwo.level) * 10;
      await this.playerService.addExperience(battle.winner, xp);
      battle.winner.gold += 20;

      await this.playerRepo.save([battle.playerOne, battle.playerTwo]);
    }

    await this.battleUnitRepo.save([attackerUnit, defenderUnit]);
    await this.battleUnitRepo.delete({ battle: { id: battle.id } });
    await this.battleLogRepo.save({
      battle,
      turnNumber: battle.currentTurn,
      attackerUnit,
      defenderUnit,
      attacker: battle.playerOne,
      defender: battle.playerTwo,
      damageDealtToAttacker: summary.defenderDamage,
      damageDealtToDefender: summary.attackerDamage,
      attackerCrit: summary.attackerCrit,
      defenderCrit: summary.defenderCrit,
      attackerDodged: summary.attackerDodge,
      defenderDodged: summary.defenderDodge,
      createdAt: now,
    });

    battle.attackerSelectedUnit = null;
    battle.defenderSelectedUnit = null;
    battle.currentTurn++;
    battle.turnStartedAt = now;

    const saved = await this.battleRepo.save(battle);
    const fullBattle = await this.findOne(saved.id);

    return {
      battle: fullBattle,
      summary,
    };
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
    return battle;
  }
}
