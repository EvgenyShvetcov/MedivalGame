import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Location } from 'src/location/entities/location.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { UnitType } from 'src/unit/unit-type.enum';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,

    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create(createPlayerDto);
    const baseUnitLevel = 1;
    const unitAmount = 15;

    const baseDamageByType: Record<UnitType, number> = {
      [UnitType.INFANTRY]: 10,
      [UnitType.ARCHER]: 12,
      [UnitType.CAVALRY]: 15,
    };

    const units: Unit[] = Object.values(UnitType).map((type) =>
      this.unitRepository.create({
        owner: player,
        type,
        level: baseUnitLevel,
        amount: unitAmount,
        baseDamage: baseDamageByType[type],
      }),
    );

    this.unitRepository.save(units);
    return this.playerRepository.save(player);
  }

  async isOnline(authId: string): Promise<boolean> {
    const player = await this.playerRepository.findOne({
      where: { id: authId },
      select: ['lastSeenAt'],
    });

    if (!player?.lastSeenAt) return false;

    const diffMs = Date.now() - player.lastSeenAt.getTime();
    return diffMs <= 30_000; // 30 секунд
  }

  async updateLastSeen(authId: string): Promise<void> {
    const player = await this.playerRepository.findOneBy({ authId });
    if (!player) return;

    player.lastSeenAt = new Date();

    // 🔁 Восстановление здоровья через 5 минут после боя
    const now = new Date();
    const minutesSinceBattle =
      player.lastBattleEndedAt &&
      (now.getTime() - player.lastBattleEndedAt.getTime()) / 1000 / 60;

    if (minutesSinceBattle && minutesSinceBattle >= 5) {
      player.health = 100; // можно сделать формулу: 100 + level * 10
      player.lastBattleEndedAt = null;
    }

    await this.playerRepository.save(player);
  }

  findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: {
        location: { availableDestinations: true },
        items: { item: true },
      },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    // Подсчёт бонусов от экипированных вещей
    const equippedItems = player.items.filter((pi) => pi.isEquipped);
    const bonusTotals: Record<string, number> = {};

    for (const pi of equippedItems) {
      const bonuses = pi.item.bonuses || {};
      for (const [key, value] of Object.entries(bonuses)) {
        bonusTotals[key] = (bonusTotals[key] || 0) + value;
      }
    }

    // Применяем бонусы к копии игрока (без записи в БД!)
    const finalPlayer = {
      ...player,
      strength: player.strength + (bonusTotals.strength || 0),
      agility: player.agility + (bonusTotals.agility || 0),
      defense: player.defense + (bonusTotals.defense || 0),
      archerAttack: player.archerAttack + (bonusTotals.archerAttack || 0),
      archerDefense: player.archerDefense + (bonusTotals.archerDefense || 0),
      infantryAttack: player.infantryAttack + (bonusTotals.infantryAttack || 0),
      infantryDefense:
        player.infantryDefense + (bonusTotals.infantryDefense || 0),
      cavalryAttack: player.cavalryAttack + (bonusTotals.cavalryAttack || 0),
      cavalryDefense: player.cavalryDefense + (bonusTotals.cavalryDefense || 0),
      bonuses: bonusTotals,
    };

    return finalPlayer;
  }

  async findByAuthId(authId: string): Promise<Player | null> {
    return this.playerRepository.findOne({ where: { authId } });
  }

  async findByUsername(username: string): Promise<Player | null> {
    return this.playerRepository.findOne({ where: { username } });
  }

  async addExperience(player: Player, gainedXp: number): Promise<Player> {
    player.experience += gainedXp;

    // Прокачка: пока хватает опыта — повышаем уровень
    while (player.experience >= this.getRequiredXp(player.level)) {
      player.experience -= this.getRequiredXp(player.level);
      player.level += 1;
      player.attributePoints += 5;
    }

    return this.playerRepository.save(player);
  }

  private getRequiredXp(level: number): number {
    return level * (level + 1) * 50;
  }

  async checkAndRestoreHealth(player: Player): Promise<void> {
    const now = new Date();

    if (
      player.lastBattleEndedAt &&
      now.getTime() - player.lastBattleEndedAt.getTime() > 5 * 60 * 1000
    ) {
      if (player.health < 100) {
        player.health = 100;
        await this.playerRepository.save(player);
      }
    }
  }

  async changeLocation(playerId: string, locationKey: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ['location'],
    });

    if (!player) throw new NotFoundException('Игрок не найден');

    const newLocation = await this.locationRepository.findOne({
      where: { key: locationKey },
    });

    if (!newLocation) throw new NotFoundException('Локация не найдена');

    const currentLocation = await this.locationRepository.findOne({
      where: { id: player.location?.id },
      relations: ['availableDestinations'],
    });

    const isAllowed = currentLocation?.availableDestinations.some(
      (loc) => loc.key === locationKey,
    );

    if (!isAllowed) {
      throw new Error('Нельзя перейти в эту локацию');
    }

    player.location = newLocation;
    return this.playerRepository.save(player);
  }
}
