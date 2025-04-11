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

    playerOne.currentBattleId = savedBattle.id;
    playerTwo.currentBattleId = savedBattle.id;

    await this.playerRepo.save([playerOne, playerTwo]);

    return savedBattle;
  }

  async findAll(): Promise<Battle[]> {
    return this.battleRepo.find({
      relations: [
        'playerOne',
        'playerTwo',
        'winner',
        'attackerSelectedUnit',
        'defenderSelectedUnit',
      ],
    });
  }

  async findOne(id: string): Promise<Battle> {
    const battle = await this.battleRepo.findOne({
      where: { id },
      relations: [
        'playerOne',
        'playerOne.units', // ⬅️ обязательно!
        'playerTwo',
        'playerTwo.units', // ⬅️ обязательно!
        'winner',
        'attackerSelectedUnit',
        'defenderSelectedUnit',
      ],
    });

    if (!battle) {
      throw new NotFoundException(`Battle with id ${id} not found`);
    }

    return battle;
  }

  async remove(id: string): Promise<void> {
    const result = await this.battleRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Battle with id ${id} not found`);
    }
  }

  async update(id: string, dto: UpdateBattleDto): Promise<Battle> {
    const battle = await this.battleRepo.findOne({
      where: { id },
      relations: [
        'playerOne',
        'playerTwo',
        'attackerSelectedUnit',
        'defenderSelectedUnit',
      ],
    });

    if (!battle) throw new NotFoundException('Battle not found');

    if (dto.playerOneSelectedUnitId) {
      const unit = await this.unitRepo.findOneByOrFail({
        id: dto.playerOneSelectedUnitId,
      });
      battle.attackerSelectedUnit = unit;
    }

    if (dto.playerTwoSelectedUnitId) {
      const unit = await this.unitRepo.findOneByOrFail({
        id: dto.playerTwoSelectedUnitId,
      });
      battle.defenderSelectedUnit = unit;
    }

    return this.battleRepo.save(battle);
  }

  async chooseUnit(
    battleId: string,
    playerId: string,
    unitId: string,
  ): Promise<{ message: string }> {
    const battle = await this.battleRepo.findOne({
      where: { id: battleId },
      relations: [
        'playerOne',
        'playerTwo',
        'attackerSelectedUnit',
        'defenderSelectedUnit',
      ],
    });

    if (!battle) throw new NotFoundException('Battle not found');

    const unit = await this.unitRepo.findOneBy({ id: unitId });
    if (!unit) throw new NotFoundException('Unit not found');

    // Кто выбирает
    const isPlayerOne = battle.playerOne.id === playerId;
    const isPlayerTwo = battle.playerTwo.id === playerId;

    if (!isPlayerOne && !isPlayerTwo) {
      throw new UnauthorizedException('Not your battle');
    }

    if (isPlayerOne) {
      battle.attackerSelectedUnit = unit;
    } else {
      battle.defenderSelectedUnit = unit;
    }

    await this.battleRepo.save(battle);

    if (!battle.isFinished) {
      await this.playerRepo.save([battle.playerOne, battle.playerTwo]);
    }

    return { message: 'Unit selected' };
  }

  async processBattleTurn(battleId: string): Promise<{
    battle: Battle;
    summary: {
      attackerDodge: boolean;
      defenderDodge: boolean;
      attackerCrit: boolean;
      defenderCrit: boolean;
      attackerDamage: number;
      defenderDamage: number;
    };
  }> {
    const battle = await this.battleRepo.findOne({
      where: { id: battleId },
      relations: [
        'playerOne',
        'playerTwo',
        'attackerSelectedUnit',
        'defenderSelectedUnit',
      ],
    });

    if (!battle) throw new NotFoundException('Битва не найдена');
    if (battle.isFinished) throw new BadRequestException('Битва уже завершена');

    let attackerUnit = battle.attackerSelectedUnit;
    let defenderUnit = battle.defenderSelectedUnit;

    // Если бот участвует и не выбрал юнита — выбираем случайного
    if (!attackerUnit && battle.playerOne.isBot) {
      const botUnits = await this.unitRepo.find({
        where: { playerId: battle.playerOne.id },
      });
      attackerUnit = botUnits[Math.floor(Math.random() * botUnits.length)];
      battle.attackerSelectedUnit = attackerUnit;
    }

    if (!defenderUnit && battle.playerTwo.isBot) {
      const botUnits = await this.unitRepo.find({
        where: { playerId: battle.playerTwo.id },
      });
      defenderUnit = botUnits[Math.floor(Math.random() * botUnits.length)];
      battle.defenderSelectedUnit = defenderUnit;
    }

    if (!attackerUnit || !defenderUnit) {
      throw new BadRequestException('Оба игрока ещё не выбрали юниты');
    }

    const now = new Date();
    const winnerSide = this.compareUnits(attackerUnit.type, defenderUnit.type);

    // Summary для фронта
    const summary = {
      attackerDodge: false,
      defenderDodge: false,
      attackerCrit: false,
      defenderCrit: false,
      attackerDamage: 0,
      defenderDamage: 0,
    };

    if (winnerSide === 'attacker') {
      const dodge =
        Math.random() * 100 < calculateDodgeChance(battle.playerTwo);
      summary.defenderDodge = dodge;

      if (!dodge) {
        let dmg = calculateDamage(
          battle.playerOne,
          battle.playerTwo,
          attackerUnit,
        );
        const crit =
          Math.random() * 100 < calculateCritChance(battle.playerOne);
        summary.attackerCrit = crit;
        if (crit) dmg *= 2;
        summary.attackerDamage = dmg;
        battle.playerTwo.health -= dmg;
      }
    }

    if (winnerSide === 'defender') {
      const dodge =
        Math.random() * 100 < calculateDodgeChance(battle.playerOne);
      summary.attackerDodge = dodge;

      if (!dodge) {
        let dmg = calculateDamage(
          battle.playerTwo,
          battle.playerOne,
          defenderUnit,
        );
        const crit =
          Math.random() * 100 < calculateCritChance(battle.playerTwo);
        summary.defenderCrit = crit;
        if (crit) dmg *= 2;
        summary.defenderDamage = dmg;
        battle.playerOne.health -= dmg;
      }
    }

    const isPlayerOneDead = battle.playerOne.health <= 0;
    const isPlayerTwoDead = battle.playerTwo.health <= 0;

    if (isPlayerOneDead || isPlayerTwoDead) {
      const winner = isPlayerOneDead ? battle.playerTwo : battle.playerOne;
      const loser = isPlayerOneDead ? battle.playerOne : battle.playerTwo;

      battle.winner = winner;
      battle.isFinished = true;

      battle.playerOne.currentBattleId = null;
      battle.playerTwo.currentBattleId = null;
      battle.playerOne.lastBattleEndedAt = now;
      battle.playerTwo.lastBattleEndedAt = now;

      const isBotBattle = loser.isBot === true;
      const baseXp = 50;
      const levelBonus = loser.level * 10;
      const finalXp = isBotBattle
        ? Math.floor((baseXp + levelBonus) / 2)
        : baseXp + levelBonus;

      await this.playerService.addExperience(winner, finalXp);
      winner.gold += 20;

      await this.playerRepo.save([winner, loser]);
    }

    await this.battleLogRepo.save({
      battle,
      turnNumber: battle.currentTurn,
      attackerUnit,
      defenderUnit,
      attacker: battle.playerOne,
      defender: battle.playerTwo,
      damageDealtToDefender: summary.attackerDamage,
      damageDealtToAttacker: summary.defenderDamage,
      attackerCrit: summary.attackerCrit,
      defenderCrit: summary.defenderCrit,
      attackerDodged: summary.attackerDodge,
      defenderDodged: summary.defenderDodge,
      createdAt: now,
    });

    battle.attackerSelectedUnit = null;
    battle.defenderSelectedUnit = null;
    battle.currentTurn += 1;
    battle.turnStartedAt = now;

    const updatedBattle = await this.battleRepo.save(battle);

    return {
      battle: updatedBattle,
      summary,
    };
  }

  async getLogsForBattle(battleId: string): Promise<BattleLog[]> {
    return this.battleLogRepo.find({
      where: { battle: { id: battleId } },
      relations: [
        'battle',
        'attacker',
        'defender',
        'attackerUnit',
        'defenderUnit',
      ],
      order: { turnNumber: 'ASC' },
    });
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

  async createBotBattle(playerId: string): Promise<Battle> {
    const player = await this.playerRepo.findOneByOrFail({ id: playerId });

    const bot = this.playerRepo.create({
      password: 'bot-password',
      username: 'Бот',
      isBot: true,
      level: player.level, // или ниже
      experience: 0,
      gold: 0,
      health: 100,
      strength: 5,
      agility: 5,
      defense: 5,
      archerAttack: 5,
      archerDefense: 5,
      infantryAttack: 5,
      infantryDefense: 5,
      cavalryAttack: 5,
      cavalryDefense: 5,
      infantryCount: 3,
      archerCount: 3,
      cavalryCount: 3,
      unitLevel: 1,
      attributePoints: 0,
      authId: `${player.id}-bot-${Date.now()}`, // фейковый, уникальный
    });

    const savedBot = await this.playerRepo.save(bot);

    // 🧠 Генерация юнитов для бота
    const unitAmount = 150;
    const baseLevel = 1;
    const baseDamageByType: Record<UnitType, number> = {
      [UnitType.INFANTRY]: 10,
      [UnitType.ARCHER]: 12,
      [UnitType.CAVALRY]: 15,
    };

    const botUnits = Object.values(UnitType).map((type) =>
      this.unitRepo.create({
        owner: savedBot,
        type,
        level: baseLevel,
        amount: unitAmount,
        baseDamage: baseDamageByType[type],
      }),
    );

    await this.unitRepo.save(botUnits);

    return this.create({ playerTwoId: savedBot.id }, player.id);
  }

  async getCurrentBattle(playerId: string): Promise<Battle | null> {
    const player = await this.playerRepo.findOneByOrFail({ id: playerId });

    if (!player.currentBattleId) return null;

    return this.findOne(player.currentBattleId); // уже с units
  }

  async leaveBattle(playerId: string): Promise<void> {
    const player = await this.playerRepo.findOneByOrFail({ id: playerId });

    if (!player.currentBattleId) return;

    const battle = await this.battleRepo.findOne({
      where: { id: player.currentBattleId },
      relations: ['playerOne', 'playerTwo'],
    });

    if (!battle) return;

    const opponent =
      battle.playerOne.id === player.id ? battle.playerTwo : battle.playerOne;

    // Если соперник — бот, удаляем его и его юниты
    if (opponent.isBot) {
      await this.unitRepo.delete({ owner: { id: opponent.id } });
      await this.playerRepo.delete(opponent.id);
    }

    player.currentBattleId = null;
    await this.playerRepo.save(player);

    // Можно также удалить саму битву, если нужно
    await this.battleRepo.delete(battle.id);
  }
}
