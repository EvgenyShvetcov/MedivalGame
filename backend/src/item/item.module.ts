// src/item/item.module.ts
// src/item/item.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { PlayerItem } from './entities/player-item.entity';
import { Player } from 'src/player/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, PlayerItem, Player])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
