import { ApiProperty } from '@nestjs/swagger';

export class ChooseUnitDto {
  @ApiProperty({ description: 'ID битвы' })
  battleId: string;

  @ApiProperty({ description: 'ID выбранного юнита' })
  unitId: string;
}
