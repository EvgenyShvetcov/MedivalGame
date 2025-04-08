import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Player } from 'src/player/entities/player.entity';
import { BuyUnitDto } from './dto/buy-unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  async getById(id: string): Promise<Unit> {
    const unit = await this.unitRepository.findOne({ where: { id } });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
    return unit;
  }

  async getByPlayerId(playerId: string): Promise<Unit[]> {
    return this.unitRepository.find({
      where: {
        owner: Equal(playerId),
      },
      relations: ['owner'],
    });
  }

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const unit = this.unitRepository.create(createUnitDto);
    return this.unitRepository.save(unit);
  }

  async delete(id: string, playerId: string): Promise<{ message: string }> {
    const unit = await this.unitRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    if (unit.owner.id !== playerId) {
      throw new NotFoundException('You do not own this unit');
    }

    await this.unitRepository.remove(unit);
    return { message: 'Unit deleted' };
  }

  async buyUnit(
    player: Player,
    dto: BuyUnitDto,
  ): Promise<{ message: string; unit: Unit; gold: number; cost: number }> {
    const unitCost = 50;

    if (player.gold < unitCost) {
      throw new BadRequestException('Недостаточно золота для покупки юнита');
    }

    const unit = this.unitRepository.create({
      type: dto.type,
      level: player.unitLevel,
      owner: player,
    });

    player.gold -= unitCost;

    await this.unitRepository.manager.getRepository(Player).save(player);
    const savedUnit = await this.unitRepository.save(unit);

    return {
      message: 'Юнит успешно куплен',
      unit: savedUnit,
      gold: player.gold,
      cost: unitCost,
    };
  }

  async buyUnitByPlayerId(
    playerId: string,
    dto: BuyUnitDto,
  ): Promise<{ message: string; unit: Unit; gold: number; cost: number }> {
    const playerRepo = this.unitRepository.manager.getRepository(Player);
    const player = await playerRepo.findOne({
      where: { authId: playerId },
      relations: ['location'],
    });

    if (!player) {
      throw new NotFoundException('Игрок не найден');
    }

    if (!player.location || !player.location.isShop) {
      throw new BadRequestException('Покупать юнитов можно только в магазине');
    }

    return this.buyUnit(player, dto);
  }

  async sellUnit(
    unitId: string,
    playerId: string,
  ): Promise<{ message: string; gold: number }> {
    const unit = await this.unitRepository.findOne({
      where: { id: unitId },
      relations: ['owner'],
    });

    if (!unit) {
      throw new NotFoundException('Юнит не найден');
    }

    if (unit.owner.id !== playerId) {
      throw new BadRequestException('Этот юнит не принадлежит вам');
    }

    const playerRepo = this.unitRepository.manager.getRepository(Player);
    const player = await playerRepo.findOneByOrFail({ id: playerId });

    const refundAmount = 25;
    player.gold += refundAmount;

    await this.unitRepository.remove(unit);
    await playerRepo.save(player);

    return { message: 'Юнит продан', gold: player.gold };
  }
}
