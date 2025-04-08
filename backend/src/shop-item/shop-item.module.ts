import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItem } from './entities/shop-item.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { ShopItemService } from './shop-item.service';
import { ShopItemController } from './shop-item.controller';
import { Player } from 'src/player/entities/player.entity';
import { Location } from 'src/location/entities/location.entity';
import { PlayerModule } from 'src/player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopItem, Shop, Player, Location]),
    PlayerModule,
  ],
  controllers: [ShopItemController],
  providers: [ShopItemService],
})
export class ShopItemModule {}
