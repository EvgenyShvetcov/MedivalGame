import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentPlayer } from 'src/auth/decorators/current-player.decorator';
import { ChangeLocationDto } from './dto/change-location.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('ping')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Пинг игрока — обновление времени активности (lastSeenAt)',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Время активности обновлено' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async ping(@CurrentPlayer() player: { userId: string }) {
    await this.playerService.updateLastSeen(player.userId);
    return { success: true, updatedAt: new Date() };
  }

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  findAll(): Promise<Player[]> {
    return this.playerService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Профиль текущего игрока' })
  @ApiResponse({ status: 200, description: 'Успешно' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async getMe(
    @CurrentPlayer() playerPayload: { userId: string; username: string },
  ) {
    const player = await this.playerService.findOne(playerPayload.userId);
    //  Восстановление здоровья, если прошло более 5 минут
    await this.playerService.checkAndRestoreHealth(player);
    return player;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Player> {
    return this.playerService.findOne(id);
  }

  @Get('online')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Проверка статуса онлайн' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async checkOnline(@CurrentPlayer() player: { userId: string }) {
    const isOnline = await this.playerService.isOnline(player.userId);
    return { online: isOnline };
  }

  @Post('change-location')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Сменить локацию игрока' })
  @ApiResponse({ status: 200, description: 'Локация успешно обновлена' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async changeLocation(
    @CurrentPlayer() player: { userId: string },
    @Body() dto: ChangeLocationDto,
  ) {
    return this.playerService.changeLocation(player.userId, dto.locationKey);
  }
}
