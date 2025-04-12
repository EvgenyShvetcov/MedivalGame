import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import { ShopItem } from 'src/shop-item/entities/shop-item.entity';
import { Player } from 'src/player/entities/player.entity';
import { PlayerItem } from 'src/item/entities/player-item.entity';
import { Item } from 'src/item/entities/item.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private shopRepo: Repository<Shop>,

    @InjectRepository(ShopItem)
    private shopItemRepo: Repository<ShopItem>,

    @InjectRepository(Player)
    private playerRepo: Repository<Player>,

    @InjectRepository(Item)
    private itemRepo: Repository<Item>,

    @InjectRepository(PlayerItem)
    private playerItemRepo: Repository<PlayerItem>,
  ) {}

  async findAll(): Promise<Shop[]> {
    return this.shopRepo.find({
      relations: ['items', 'items.item'],
    });
  }

  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopRepo.findOne({
      where: { id },
      relations: ['items', 'items.item'],
    });

    if (!shop) throw new NotFoundException('Магазин не найден');
    return shop;
  }

  async findByLocation(locationId: string): Promise<Shop> {
    const shop = await this.shopRepo.findOne({
      where: { location: { id: locationId } },
      relations: ['items', 'items.item'],
    });

    if (!shop) {
      throw new NotFoundException('Магазин для этой локации не найден');
    }

    return shop;
  }

  async buy(shopItemId: string, playerId: string) {
    const shopItem = await this.shopItemRepo.findOne({
      where: { id: shopItemId },
      relations: ['item', 'shop'],
    });

    if (!shopItem) throw new NotFoundException('Товар не найден');

    const player = await this.playerRepo.findOneByOrFail({ id: playerId });

    if (player.gold < shopItem.price) {
      throw new BadRequestException('Недостаточно золота');
    }

    if (shopItem.itemType === 'ITEM') {
      const item = await this.itemRepo.findOneByOrFail({
        id: shopItem.itemId,
      });

      const playerItem = this.playerItemRepo.create({
        owner: player,
        item,
        isEquipped: false,
      });

      await this.playerItemRepo.save(playerItem);
    }

    player.gold -= shopItem.price;
    await this.playerRepo.save(player);

    return { message: 'Покупка успешна' };
  }
}
