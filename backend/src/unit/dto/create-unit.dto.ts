import { ApiProperty } from '@nestjs/swagger';
import { UnitType } from '../unit-type.enum';

export class CreateUnitDto {
  @ApiProperty({ enum: UnitType })
  type: UnitType;

  @ApiProperty({ example: 1, required: false })
  level?: number;

  @ApiProperty({ example: 10, required: false })
  amount?: number;

  @ApiProperty({ example: 10, required: false })
  baseDamage?: number;

  @ApiProperty({ example: 'stun', required: false })
  specialEffect?: string;

  @ApiProperty({ example: 'd7e8a2ff-8c3d-42ea-9cc9-621f8cba7cd5' })
  playerId: string;
}
