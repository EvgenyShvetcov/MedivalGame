import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string; // например: 'city', 'arena', 'shop'

  @Column()
  name: string; // отображаемое имя: 'Город'

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: false })
  isBattleArena: boolean;

  @Column({ default: false })
  isShop: boolean;

  @Column({ default: false })
  isCity: boolean;

  @ManyToMany(() => Location, { eager: true })
  @JoinTable()
  availableDestinations: Location[];
}
