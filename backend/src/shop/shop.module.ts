import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 💥 Не забудь это!
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { Shop } from './entities/shop.entity';
import { ShopItem } from 'src/shop-item/entities/shop-item.entity';
import { Player } from 'src/player/entities/player.entity';
import { Item } from 'src/item/entities/item.entity';
import { PlayerItem } from 'src/item/entities/player-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, ShopItem, Player, Item, PlayerItem]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
