import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ItemRarity } from '../emuns/item-rarity.enum';
import { ItemSlot } from '../emuns/item-slot.enum';

export class CreateItemDto {
  @ApiProperty({ example: 'Шлем воина' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Прочный шлем, дающий +3 к защите' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ItemSlot })
  @IsEnum(ItemSlot)
  slot: ItemSlot;

  @ApiProperty({ enum: ItemRarity })
  @IsEnum(ItemRarity)
  rarity: ItemRarity;

  @ApiProperty({ example: 1 })
  @IsNumber()
  level: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  strengthBonus: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  defenseBonus: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'https://example.com/item.png' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'stun', required: false })
  @IsString()
  @IsOptional()
  specialEffect?: string;
}
