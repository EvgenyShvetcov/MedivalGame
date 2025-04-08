import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Player } from 'src/player/entities/player.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { BattleLog } from './battle-log.entity';

@Entity()
export class Battle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Player, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  playerOne: Player;

  @ManyToOne(() => Player, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  playerTwo: Player;

  @Column({ default: false })
  isFinished: boolean;

  @Column({ default: 0 })
  currentTurn: number;

  @ManyToOne(() => Player, { nullable: true, onDelete: 'CASCADE' })
  winner: Player;

  @Column({ type: 'timestamp', nullable: true })
  turnStartedAt: Date;

  @Column({ type: 'int', default: 30 })
  turnDuration: number;

  @ManyToOne(() => Unit, { nullable: true, onDelete: 'SET NULL' })
  attackerSelectedUnit: Unit | null;

  @ManyToOne(() => Unit, { nullable: true, onDelete: 'SET NULL' })
  defenderSelectedUnit: Unit | null;

  @OneToMany(() => BattleLog, (log) => log.battle)
  logs: BattleLog[];
}
