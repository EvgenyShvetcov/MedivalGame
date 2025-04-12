import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItemService } from './shop-item.service';
import { ShopItemController } from './shop-item.controller';
import { ShopItem } from './entities/shop-item.entity';
import { Shop } from '../shop/entities/shop.entity';
import { Player } from '../player/entities/player.entity';
import { PlayerItem } from '../item/entities/player-item.entity';
import { Item } from '../item/entities/item.entity';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopItem, Shop, Player, PlayerItem, Item]),
    PlayerModule,
  ],
  controllers: [ShopItemController],
  providers: [ShopItemService],
})
export class ShopItemModule {}
