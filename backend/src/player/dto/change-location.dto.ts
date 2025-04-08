import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeLocationDto {
  @ApiProperty({ description: 'ID новой локации', example: 'uuid-location' })
  @IsUUID()
  locationId: string;
}
