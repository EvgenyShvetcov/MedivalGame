import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { Shop } from './entities/shop.entity';
import { ShopItem } from '../shop-item/entities/shop-item.entity';
import { Player } from '../player/entities/player.entity';
import { PlayerItem } from '../item/entities/player-item.entity';
import { Item } from '../item/entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, ShopItem, Player, PlayerItem, Item]), // ✅ Тут обязательно должен быть Shop
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService], // если ты используешь его где-то ещё
})
export class ShopModule {}
