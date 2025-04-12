import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Player } from 'src/player/entities/player.entity';
import { BattleService } from './battle.service';
import { PlayerService } from 'src/player/player.service';
import { Battle } from './entities/battle.entity';

@Injectable()
export class MatchmakingService {
  private queue: Player[] = [];

  constructor(
    @Inject(forwardRef(() => BattleService))
    private readonly battleService: BattleService,
    private readonly playerService: PlayerService,
  ) {}

  async joinQueue(playerId: string): Promise<Battle | null> {
    const player = await this.playerService.findOne(playerId);

    // уже в очереди — пропускаем
    if (this.queue.find((p) => p.id === player.id)) return null;

    // ищем соперника
    const opponent = this.queue.find((p) => p.id !== player.id);

    if (opponent) {
      // убираем обоих из очереди
      this.queue = this.queue.filter(
        (p) => p.id !== player.id && p.id !== opponent.id,
      );

      // создаём битву
      return this.battleService.create({ playerTwoId: opponent.id }, player.id);
    }

    this.queue.push(player);
    return null;
  }

  leaveQueue(playerId: string) {
    this.queue = this.queue.filter((p) => p.id !== playerId);
  }
}
