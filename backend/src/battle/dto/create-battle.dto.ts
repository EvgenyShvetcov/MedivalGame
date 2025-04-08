import { IsUUID } from 'class-validator';

export class CreateBattleDto {
  @IsUUID()
  playerTwoId: string;
}
