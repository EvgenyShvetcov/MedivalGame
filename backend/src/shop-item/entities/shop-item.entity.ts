import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shop } from 'src/shop/entities/shop.entity';
import { UnitType } from 'src/unit/unit-type.enum';

export enum ShopItemType {
  UNIT = 'UNIT',
  ITEM = 'ITEM', // для будущих предметов
}

@Entity()
export class ShopItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Shop, (shop) => shop.items, { onDelete: 'CASCADE' })
  shop: Shop;

  @Column({ type: 'enum', enum: ShopItemType })
  itemType: ShopItemType;

  // --- Для юнитов ---
  @Column({ type: 'enum', enum: UnitType, nullable: true })
  unitType?: UnitType;

  @Column({ nullable: true })
  level?: number;

  // --- Общие поля ---
  @Column()
  price: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'int', nullable: true })
  stock?: number;

  @Column({ type: 'uuid', nullable: true })
  itemId?: string;
}
