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
  @ApiProperty({ example: '1cf9a7c3-53e4-44f1-b2a0-123abc456def' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: UnitType })
  @Column({ type: 'enum', enum: UnitType })
  type: UnitType;

  @ApiProperty({ example: 1 })
  @Column({ default: 1 })
  level: number;

  @ApiProperty({ example: 10 })
  @Column({ default: 10 })
  amount: number;

  @ApiProperty({ example: 10 })
  @Column({ default: 10 })
  baseDamage: number;

  @ApiProperty({ example: 'stun', required: false })
  @Column({ nullable: true })
  specialEffect?: string;

  @ApiProperty({ type: () => Player })
  @ManyToOne(() => Player, (player) => player.units, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playerId' })
  owner: Player;

  @ApiProperty({ example: 'd7e8a2ff-8c3d-4e2a-9cc9-621f8cba7cd5' })
  @Column()
  playerId: string;

  @Column({ nullable: true })
  imageUrl?: string;
}
