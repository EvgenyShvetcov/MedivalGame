import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class AssignAttributesDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  strength?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  agility?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  defense?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  infantryAttack?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  archerAttack?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cavalryAttack?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  infantryDefense?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  archerDefense?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cavalryDefense?: number;
}
