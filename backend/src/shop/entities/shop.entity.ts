import { Location } from 'src/location/entities/location.entity';
import { ShopItem } from 'src/shop-item/entities/shop-item.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Location, { eager: true })
  location: Location;

  @OneToMany(() => ShopItem, (item) => item.shop, { cascade: true })
  items: ShopItem[];
}
