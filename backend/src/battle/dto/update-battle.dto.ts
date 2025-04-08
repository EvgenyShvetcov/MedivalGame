import { IsUUID, IsOptional } from 'class-validator';

export class UpdateBattleDto {
  @IsOptional()
  @IsUUID()
  playerOneSelectedUnitId?: string;

  @IsOptional()
  @IsUUID()
  playerTwoSelectedUnitId?: string;
}
