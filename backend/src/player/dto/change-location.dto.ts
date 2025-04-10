import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeLocationDto {
  @ApiProperty({ description: 'ID новой локации', example: 'uuid-location' })
  @IsString()
  locationKey: string;
}
