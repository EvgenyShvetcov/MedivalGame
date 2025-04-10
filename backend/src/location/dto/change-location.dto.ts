import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeLocationDto {
  @ApiProperty({ example: 'arena' })
  @IsString()
  locationKey: string;
}
