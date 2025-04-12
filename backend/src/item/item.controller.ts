import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Item } from './entities/item.entity';
import { PlayerItem } from './entities/player-item.entity';
import { CurrentPlayer } from 'src/auth/decorators/current-player.decorator';

@ApiTags('Items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiOperation({ summary: 'Создать предмет' })
  @ApiBody({ type: CreateItemDto })
  @ApiResponse({ status: 201, type: Item })
  create(@Body() dto: CreateItemDto) {
    return this.itemService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все предметы' })
  @ApiResponse({ status: 200, type: [Item] })
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить предмет по ID' })
  @ApiParam({ name: 'id', description: 'UUID предмета' })
  @ApiResponse({ status: 200, type: Item })
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить предмет' })
  @ApiParam({ name: 'id', description: 'UUID предмета' })
  @ApiBody({ type: UpdateItemDto })
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить предмет' })
  @ApiParam({ name: 'id', description: 'UUID предмета' })
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }

  // Игровые действия

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('player/me')
  @ApiOperation({ summary: 'Получить предметы текущего игрока' })
  @ApiResponse({ status: 200, type: [PlayerItem] })
  getMyItems(@CurrentPlayer() player: { userId: string }) {
    return this.itemService.getItemsByPlayer(player.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('player/me/equipped')
  @ApiOperation({ summary: 'Получить экипированные предметы игрока' })
  @ApiResponse({ status: 200, type: [PlayerItem] })
  getEquipped(@CurrentPlayer() player: { userId: string }) {
    return this.itemService.getEquippedItems(player.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/equip')
  @ApiOperation({ summary: 'Экипировать предмет' })
  @ApiParam({ name: 'id', description: 'UUID PlayerItem' })
  equip(@Param('id') id: string, @CurrentPlayer() player: { userId: string }) {
    return this.itemService.equipItem(player.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/unequip')
  @ApiOperation({ summary: 'Снять предмет' })
  @ApiParam({ name: 'id', description: 'UUID PlayerItem' })
  unequip(
    @Param('id') id: string,
    @CurrentPlayer() player: { userId: string },
  ) {
    return this.itemService.unequipItem(player.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/sell')
  @ApiOperation({ summary: 'Продать предмет' })
  @ApiParam({ name: 'id', description: 'UUID PlayerItem' })
  sell(@Param('id') id: string, @CurrentPlayer() player: { userId: string }) {
    return this.itemService.sellItem(player.userId, id);
  }
}
