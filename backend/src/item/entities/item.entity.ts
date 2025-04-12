// src/item/entities/item.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ItemSlot } from '../emuns/item-slot.enum';
import { ItemRarity } from '../emuns/item-rarity.enum';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'enum', enum: ItemRarity })
  rarity: ItemRarity;

  @Column({ type: 'enum', enum: ItemSlot })
  slot: ItemSlot;

  @Column({ type: 'int', default: 0 })
  requiredLevel: number;

  @Column({ type: 'jsonb', nullable: true })
  bonuses: Record<string, number>; // например: { strength: +3, defense: +1 }
}
