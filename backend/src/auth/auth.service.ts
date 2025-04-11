import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Player } from 'src/player/entities/player.entity';
import { Location } from 'src/location/entities/location.entity';
import { UnitType } from 'src/unit/unit-type.enum';
import { Unit } from 'src/unit/entities/unit.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async register(username: string, password: string) {
    const existing = await this.playerRepository.findOne({
      where: { username },
    });
    if (existing) throw new UnauthorizedException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const startLocation = await this.locationRepository.findOneBy({
      key: 'city',
    });

    const player = this.playerRepository.create({
      authId: username,
      username,
      password: hashedPassword,
      ...(startLocation && { location: startLocation }),
    });

    await this.playerRepository.save(player);

    // ⬇️ Добавляем юнитов игроку
    const baseLevel = 1;
    const unitAmount = 15;
    const baseDamageByType: Record<UnitType, number> = {
      [UnitType.INFANTRY]: 10,
      [UnitType.ARCHER]: 12,
      [UnitType.CAVALRY]: 15,
    };

    const unitRepo = this.playerRepository.manager.getRepository(Unit);
    const units = Object.values(UnitType).map((type) =>
      unitRepo.create({
        owner: player,
        type,
        level: baseLevel,
        amount: unitAmount,
        baseDamage: baseDamageByType[type],
      }),
    );
    await unitRepo.save(units);

    const payload = { sub: player.id, username: player.username };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async login(username: string, password: string) {
    const player = await this.playerRepository.findOne({ where: { username } });

    if (!player) {
      throw new UnauthorizedException('Player not found');
    }

    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: player.id, username: player.username };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
