import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { PlayerItem } from './entities/player-item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Player } from 'src/player/entities/player.entity';
import { ItemRarity } from './emuns/item-rarity.enum';

const rarityValueMap: Record<ItemRarity, number> = {
  [ItemRarity.COMMON]: 0,
  [ItemRarity.UNCOMMON]: 1,
  [ItemRarity.RARE]: 2,
  [ItemRarity.EPIC]: 3,
  [ItemRarity.LEGENDARY]: 4,
};

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepo: Repository<Item>,

    @InjectRepository(PlayerItem)
    private playerItemRepo: Repository<PlayerItem>,

    @InjectRepository(Player)
    private playerRepo: Repository<Player>,
  ) {}

  async create(dto: CreateItemDto): Promise<Item> {
    const item = this.itemRepo.create(dto);
    return this.itemRepo.save(item);
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepo.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepo.findOneBy({ id });
    if (!item) throw new NotFoundException('Предмет не найден');
    return item;
  }

  async update(id: string, dto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async remove(id: string): Promise<void> {
    const result = await this.itemRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Предмет не найден');
    }
  }

  async getItemsByPlayer(playerId: string): Promise<PlayerItem[]> {
    return this.playerItemRepo.find({
      where: { owner: { id: playerId } },
      relations: ['item'],
    });
  }

  async getEquippedItems(playerId: string): Promise<PlayerItem[]> {
    return this.playerItemRepo.find({
      where: {
        owner: { id: playerId },
        isEquipped: true,
      },
      relations: ['item'],
    });
  }

  async equipItem(playerId: string, playerItemId: string) {
    const playerItem = await this.playerItemRepo.findOne({
      where: { id: playerItemId },
      relations: ['owner', 'item'],
    });

    if (!playerItem || playerItem.owner.id !== playerId) {
      throw new NotFoundException('Предмет не найден или не ваш');
    }

    if (playerItem.item.requiredLevel > playerItem.owner.level) {
      throw new BadRequestException('Уровень игрока слишком низкий');
    }

    // снимаем все предметы с таким же слотом
    await this.playerItemRepo.update(
      {
        owner: { id: playerId },
        isEquipped: true,
        item: { slot: playerItem.item.slot },
      },
      { isEquipped: false },
    );

    playerItem.isEquipped = true;
    return this.playerItemRepo.save(playerItem);
  }

  async unequipItem(playerId: string, playerItemId: string) {
    const playerItem = await this.playerItemRepo.findOne({
      where: { id: playerItemId },
      relations: ['owner'],
    });

    if (!playerItem || playerItem.owner.id !== playerId) {
      throw new NotFoundException('Предмет не найден или не ваш');
    }

    playerItem.isEquipped = false;
    return this.playerItemRepo.save(playerItem);
  }

  async sellItem(playerId: string, playerItemId: string) {
    const playerItem = await this.playerItemRepo.findOne({
      where: { id: playerItemId },
      relations: ['owner', 'item'],
    });

    if (!playerItem || playerItem.owner.id !== playerId) {
      throw new NotFoundException('Предмет не найден или не ваш');
    }

    const player = await this.playerRepo.findOneBy({ id: playerId });
    if (!player) throw new NotFoundException('Игрок не найден');

    const refund = (rarityValueMap[playerItem.item.rarity] + 1) * 10;
    player.gold += refund;

    await this.playerItemRepo.remove(playerItem);
    await this.playerRepo.save(player);

    return {
      message: 'Предмет продан',
      gold: player.gold,
    };
  }
}
