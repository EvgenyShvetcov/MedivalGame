import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { UnitModule } from './unit/unit.module';
import { BattleModule } from './battle/battle.module';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './location/location.module';
import { ShopModule } from './shop/shop.module';
import { ShopItemModule } from './shop-item/shop-item.module';
import { PlayerAttributesModule } from './player-attributes/player-attributes.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/entities/*.entity.{ts,js}'],
    }),
    PlayerModule,
    BattleModule,
    UnitModule,
    AuthModule,
    LocationModule,
    ShopModule,
    ShopItemModule,
    PlayerAttributesModule,
    ItemModule,
  ],
})
export class AppModule {}
