import { IsString } from 'class-validator';
import { PlayerItem } from 'src/item/entities/player-item.entity';
import { Location } from 'src/location/entities/location.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Player {
  @IsString()
  @Column()
  password: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastSeenAt?: Date;

  @Column()
  username: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  experience: number;

  @Column({ default: 100 })
  gold: number;

  @Column({ default: 10 })
  infantryCount: number;

  @Column({ default: 100 })
  health: number;

  @Column({ default: 10 })
  archerCount: number;

  @Column({ default: 10 })
  cavalryCount: number;

  @Column({ default: 1 })
  unitLevel: number;

  @ManyToOne(() => Location, { eager: true, nullable: true })
  location: Location;

  @OneToMany(() => Unit, (unit) => unit.owner)
  units: Unit[];

  @Column({ unique: true })
  authId: string;

  @Column({ type: 'uuid', nullable: true })
  currentBattleId: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastBattleEndedAt: Date | null;

  @Column({ default: false })
  isBot: boolean;

  @Column({ default: 10 })
  strength: number;

  @Column({ default: 10 })
  agility: number;

  @Column({ default: 10 })
  defense: number;

  @Column({ default: 5 })
  archerAttack: number;

  @Column({ default: 5 })
  archerDefense: number;

  @Column({ default: 5 })
  infantryAttack: number;

  @Column({ default: 5 })
  infantryDefense: number;

  @Column({ default: 5 })
  cavalryAttack: number;

  @Column({ default: 5 })
  cavalryDefense: number;

  @Column({ default: 0 })
  attributePoints: number;

  @OneToMany(() => PlayerItem, (pi) => pi.owner)
  items: PlayerItem[];
}
