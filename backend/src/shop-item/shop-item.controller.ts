import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ShopItemService } from './shop-item.service';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShopItem, ShopItemType } from './entities/shop-item.entity';
import { CurrentPlayer } from 'src/auth/decorators/current-player.decorator';
import { PlayerService } from 'src/player/player.service';
import { UpdateShopItemDto } from './dto/update-shop-item.dto';

@ApiTags('Shop Items')
@Controller('shop-items')
export class ShopItemController {
  constructor(
    private readonly shopItemService: ShopItemService,
    private readonly playerService: PlayerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать товар магазина' })
  @ApiBody({ type: CreateShopItemDto })
  @ApiResponse({ status: 201, description: 'Товар создан', type: ShopItem })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  create(@Body() dto: CreateShopItemDto) {
    return this.shopItemService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все товары' })
  @ApiResponse({ status: 200, description: 'Список товаров', type: [ShopItem] })
  findAll() {
    return this.shopItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiParam({ name: 'id', description: 'UUID товара' })
  @ApiResponse({ status: 200, description: 'Товар найден', type: ShopItem })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  findOne(@Param('id') id: string) {
    return this.shopItemService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар по ID' })
  @ApiParam({ name: 'id', description: 'UUID товара' })
  @ApiResponse({ status: 200, description: 'Товар удалён' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  remove(@Param('id') id: string) {
    return this.shopItemService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/buy')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Покупка товара из магазина' })
  @ApiResponse({ status: 201, description: 'Успешная покупка' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно золота или товара нет',
  })
  async buy(
    @Param('id') itemId: string,
    @CurrentPlayer() player: { userId: string },
  ) {
    const fullPlayer = await this.playerService.findOne(player.userId);
    return this.shopItemService.buyItemForPlayer(fullPlayer, itemId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить товар магазина' })
  @ApiParam({ name: 'id', description: 'UUID товара' })
  @ApiBody({ type: UpdateShopItemDto })
  @ApiResponse({ status: 200, description: 'Товар обновлён', type: ShopItem })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  update(@Param('id') id: string, @Body() dto: UpdateShopItemDto) {
    return this.shopItemService.update(id, dto);
  }

  @Get('type/:type')
  @ApiParam({ name: 'type', enum: ShopItemType })
  getByType(@Param('type') type: ShopItemType) {
    return this.shopItemService.findByItemType(type);
  }
}
