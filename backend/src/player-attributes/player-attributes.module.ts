import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerAttributesService } from './player-attributes.service';
import { PlayerAttributesController } from './player-attributes.controller';
import { Player } from 'src/player/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  controllers: [PlayerAttributesController],
  providers: [PlayerAttributesService],
})
export class PlayerAttributesModule {}
