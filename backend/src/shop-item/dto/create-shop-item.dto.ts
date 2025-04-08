import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  ValidateIf,
} from 'class-validator';
import { ShopItemType } from '../entities/shop-item.entity';
import { UnitType } from 'src/unit/unit-type.enum';

export class CreateShopItemDto {
  @IsUUID()
  shopId: string;

  @IsEnum(ShopItemType)
  itemType: ShopItemType;

  // Если тип — юнит, ожидаем поля `unitType` и `level`
  @ValidateIf((o) => o.itemType === ShopItemType.UNIT)
  @IsEnum(UnitType)
  unitType?: UnitType;

  @ValidateIf((o) => o.itemType === ShopItemType.UNIT)
  @IsNumber()
  @Min(1)
  level?: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
