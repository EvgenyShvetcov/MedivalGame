import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { Player } from 'src/player/entities/player.entity';

@Entity()
export class PlayerItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Item, { eager: true })
  item: Item;

  @ManyToOne(() => Player, (player) => player.items, { onDelete: 'CASCADE' })
  owner: Player;

  @Column({ default: false })
  isEquipped: boolean;
}
