// src/shop/dto/create-shop.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateShopDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  locationId: string;
}
