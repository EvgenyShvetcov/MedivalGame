import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isBattleArena?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isShop?: boolean;
}
