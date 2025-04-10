import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Location } from 'src/location/entities/location.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create(createPlayerDto);
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
        location: {
          availableDestinations: true,
        },
      },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
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

  async changeLocation(playerId: string, locationId: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ['location'],
    });

    if (!player) throw new NotFoundException('Игрок не найден');

    const newLocation = await this.locationRepository.findOne({
      where: { id: locationId },
    });
    if (!newLocation) throw new NotFoundException('Локация не найдена');

    const currentLocation = await this.locationRepository.findOne({
      where: { id: player.location?.id },
      relations: ['availableDestinations'],
    });

    if (
      !currentLocation?.availableDestinations.some(
        (loc) => loc.id === locationId,
      )
    ) {
      throw new Error('Нельзя перейти в эту локацию');
    }

    player.location = newLocation;
    return this.playerRepository.save(player);
  }
}
