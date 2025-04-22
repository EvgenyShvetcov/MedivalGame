import { ApiProperty } from '@nestjs/swagger';
import { Player } from 'src/player/entities/player.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UnitType } from '../unit-type.enum';

@Entity()
export class Unit {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: UnitType })
  type: UnitType;

  @ApiProperty()
  @Column({ default: 1 })
  level: number;

  @ApiProperty()
  @Column({ default: 10 })
  amount: number;

  @ApiProperty()
  @Column({ default: 10 })
  baseDamage: number;

  @Column({ nullable: true })
  specialEffect?: string;

  @ManyToOne(() => Player, (player) => player.units, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playerId' })
  owner: Player;

  @ApiProperty()
  @Column()
  playerId: string;

  @Column({ nullable: true })
  imageUrl?: string;
}
