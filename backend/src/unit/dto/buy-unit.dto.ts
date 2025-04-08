import { IsEnum } from 'class-validator';
import { UnitType } from '../unit-type.enum';

export class BuyUnitDto {
  @IsEnum(UnitType)
  type: UnitType;
}
