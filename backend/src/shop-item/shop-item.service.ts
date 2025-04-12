import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopItem, ShopItemType } from './entities/shop-item.entity';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { Shop } from 'src/shop/entities/shop.entity';
import { Player } from 'src/player/entities/player.entity';
import { UpdateShopItemDto } from './dto/update-shop-item.dto';

@Injectable()
export class ShopItemService {
  constructor(
    @InjectRepository(ShopItem)
    private shopItemRepo: Repository<ShopItem>,

    @InjectRepository(Shop)
    private shopRepo: Repository<Shop>,
  ) {}

  async create(dto: CreateShopItemDto): Promise<ShopItem> {
    const shop = await this.shopRepo.findOneBy({ id: dto.shopId });
    if (!shop) throw new NotFoundException('Магазин не найден');

    const item = this.shopItemRepo.create({
      ...dto,
      shop,
    });

    return this.shopItemRepo.save(item);
  }

  async findByItemType(type: ShopItemType): Promise<ShopItem[]> {
    return this.shopItemRepo.find({
      where: { itemType: type },
      relations: ['item'],
    });
  }

  async findAll(): Promise<ShopItem[]> {
    return this.shopItemRepo.find({ relations: ['shop'] });
  }

  async findOne(id: string): Promise<ShopItem> {
    const item = await this.shopItemRepo.findOne({
      where: { id },
      relations: ['shop'],
    });
    if (!item) throw new NotFoundException('Товар не найден');
    return item;
  }

  async remove(id: string): Promise<void> {
    const result = await this.shopItemRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Товар не найден');
    }
  }

  async findByShopId(shopId: string): Promise<ShopItem[]> {
    return this.shopItemRepo.find({
      where: { shop: { id: shopId } },
      relations: ['shop'],
    });
  }

  async update(id: string, dto: UpdateShopItemDto): Promise<ShopItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.shopItemRepo.save(item);
  }

  async decreaseStock(itemId: string): Promise<void> {
    const item = await this.findOne(itemId);
    if (!item) throw new NotFoundException('Товар не найден');

    if (item.stock !== undefined && item.stock > 0) {
      item.stock--;
      await this.shopItemRepo.save(item);
    }
  }

  async buyItemForPlayer(
    player: Player,
    shopItemId: string,
  ): Promise<{ message: string; item: ShopItem; gold: number }> {
    const item = await this.shopItemRepo.findOne({
      where: { id: shopItemId },
      relations: ['shop'],
    });

    if (!item) throw new NotFoundException('Товар не найден');
    if (item.stock !== undefined && item.stock <= 0) {
      throw new BadRequestException('Товара больше нет в наличии');
    }
    if (player.gold < item.price) {
      throw new BadRequestException('Недостаточно золота');
    }

    // 🛒 Покупка юнита
    if (item.itemType === ShopItemType.UNIT) {
      if (!item.unitType || !item.level) {
        throw new BadRequestException('Некорректный юнит в товаре');
      }

      const unitRepo = this.shopItemRepo.manager.getRepository('Unit');
      const unit = unitRepo.create({
        type: item.unitType,
        level: item.level,
        owner: player,
      });
      await unitRepo.save(unit);
    }

    // 🧳 Покупка предмета
    if (item.itemType === ShopItemType.ITEM) {
      if (!item.itemId) {
        throw new BadRequestException('Некорректный предмет в товаре');
      }

      const itemRepo = this.shopItemRepo.manager.getRepository('Item');
      const playerItemRepo =
        this.shopItemRepo.manager.getRepository('PlayerItem');

      const gameItem = await itemRepo.findOneBy({ id: item.itemId });
      if (!gameItem) throw new NotFoundException('Предмет не найден');

      const playerItem = playerItemRepo.create({
        item: gameItem,
        owner: player,
        isEquipped: false,
      });
      await playerItemRepo.save(playerItem);
    }

    // 💸 Обновляем золото и stock
    player.gold -= item.price;
    await this.shopItemRepo.manager.getRepository('Player').save(player);

    if (item.stock !== undefined) {
      item.stock -= 1;
      await this.shopItemRepo.save(item);
    }

    return {
      message: 'Покупка прошла успешно',
      item,
      gold: player.gold,
    };
  }
}
