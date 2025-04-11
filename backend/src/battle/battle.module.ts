import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Battle } from './entities/battle.entity';
import { BattleService } from './battle.service';
import { BattleController } from './battle.controller';
import { Player } from 'src/player/entities/player.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { PlayerModule } from 'src/player/player.module';
import { BattleLog } from './entities/battle-log.entity';
import { MatchmakingService } from './matchmaking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Battle, Player, Unit, BattleLog]),
    PlayerModule,
  ],
  controllers: [BattleController],
  providers: [BattleService, MatchmakingService],
})
export class BattleModule {}
