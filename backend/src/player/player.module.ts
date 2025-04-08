import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Player } from './entities/player.entity';
import { Battle } from 'src/battle/entities/battle.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { Location } from 'src/location/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Battle, Player, Unit, Location])],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService, TypeOrmModule],
})
export class PlayerModule {}
