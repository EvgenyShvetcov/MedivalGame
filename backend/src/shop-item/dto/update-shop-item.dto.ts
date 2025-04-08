import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';
import { ShopItemType } from '../entities/shop-item.entity';
import { UnitType } from 'src/unit/unit-type.enum';

export class UpdateShopItemDto {
  @IsOptional()
  @IsEnum(ShopItemType)
  itemType?: ShopItemType;

  @IsOptional()
  @IsEnum(UnitType)
  unitType?: UnitType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  level?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

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
