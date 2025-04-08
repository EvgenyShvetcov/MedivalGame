import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Battle } from './battle.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { Player } from 'src/player/entities/player.entity';

@Entity()
export class BattleLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Battle, { onDelete: 'CASCADE' })
  battle: Battle;

  @Column()
  turnNumber: number;

  @ManyToOne(() => Unit, { eager: true, nullable: true })
  attackerUnit: Unit;

  @ManyToOne(() => Unit, { eager: true, nullable: true })
  defenderUnit: Unit;

  @ManyToOne(() => Player, { eager: true })
  attacker: Player;

  @ManyToOne(() => Player, { eager: true })
  defender: Player;

  @Column({ default: 0 })
  damageDealtToDefender: number;

  @Column({ default: 0 })
  damageDealtToAttacker: number;

  @Column({ default: false })
  attackerCrit: boolean;

  @Column({ default: false })
  defenderCrit: boolean;

  @Column({ default: false })
  attackerDodged: boolean;

  @Column({ default: false })
  defenderDodged: boolean;

  @Column({ type: 'timestamp', default: () => 'now()' })
  createdAt: Date;
}
