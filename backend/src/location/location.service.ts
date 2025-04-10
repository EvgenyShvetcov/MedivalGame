import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
  ) {}

  async create(dto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepo.create(dto);
    return this.locationRepo.save(location);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepo.find();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepo.findOneBy({ id });
    if (!location) {
      throw new NotFoundException(`Локация с id ${id} не найдена`);
    }
    return location;
  }

  async update(id: string, dto: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(id);
    const updated = Object.assign(location, dto);
    return this.locationRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.locationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Локация с id ${id} не найдена`);
    }
  }

  async findBattleArenas(): Promise<Location[]> {
    return this.locationRepo.find({ where: { isBattleArena: true } });
  }

  async findShops(): Promise<Location[]> {
    return this.locationRepo.find({ where: { isShop: true } });
  }

  async getAvailableDestinations(id: string): Promise<Location[]> {
    const location = await this.locationRepo.findOne({
      where: { id },
      relations: ['availableDestinations'],
    });
    if (!location) {
      throw new NotFoundException(`Локация с id ${id} не найдена`);
    }
    return location.availableDestinations;
  }
}
