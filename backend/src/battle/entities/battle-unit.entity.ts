import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Battle } from './battle.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { Player } from 'src/player/entities/player.entity';

@Entity()
export class BattleUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Battle, { nullable: false, onDelete: 'CASCADE' })
  battle: Battle;

  @ManyToOne(() => Player, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner: Player;

  @ManyToOne(() => Unit, { eager: true, cascade: false, onUpdate: 'NO ACTION' })
  @JoinColumn()
  originalUnit: Unit;

  @Column({ type: 'int', default: 0 })
  remaining: number;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'float' })
  baseDamage: number;
}
