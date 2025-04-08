import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from 'src/player/entities/player.entity';
import { AssignAttributesDto } from './dto/assign-attributes.dto';

@Injectable()
export class PlayerAttributesService {
  constructor(
    @InjectRepository(Player)
    private playerRepo: Repository<Player>,
  ) {}

  async assignAttributes(
    playerId: string,
    dto: AssignAttributesDto,
  ): Promise<Player> {
    const player = await this.playerRepo.findOneBy({ id: playerId });
    if (!player) throw new NotFoundException('Игрок не найден');

    if (player.currentBattleId) {
      throw new BadRequestException('Нельзя распределять очки во время битвы');
    }

    const totalToAssign = Object.values(dto).reduce(
      (sum, val) => sum + (val ?? 0),
      0,
    );

    if (totalToAssign > player.attributePoints) {
      throw new BadRequestException('Недостаточно очков для распределения');
    }

    // Применяем каждое поле
    for (const [key, value] of Object.entries(dto)) {
      if (value && typeof value === 'number') {
        player[key] += value;
      }
    }

    player.attributePoints -= totalToAssign;

    return this.playerRepo.save(player);
  }
}
