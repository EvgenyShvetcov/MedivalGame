import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Player } from 'src/player/entities/player.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async register(username: string, password: string) {
    const existing = await this.playerRepository.findOne({
      where: { username },
    });
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const player = this.playerRepository.create({
      authId: username, // или другой уникальный идентификатор
      username,
      password: hashedPassword,
    });

    await this.playerRepository.save(player);

    return { message: 'Registered' };
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
