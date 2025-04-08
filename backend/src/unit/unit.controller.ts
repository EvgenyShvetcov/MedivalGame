import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Delete,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentPlayer } from 'src/auth/decorators/current-player.decorator';
import { BuyUnitDto } from './dto/buy-unit.dto';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({ summary: 'Получить всех своих юнитов' })
  @ApiResponse({ status: HttpStatus.OK, type: [Unit] })
  getMyUnits(@CurrentPlayer() player: { userId: string }) {
    return this.unitService.getByPlayerId(player.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать нового юнита' })
  @ApiBody({ type: CreateUnitDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Unit })
  create(
    @CurrentPlayer() player: { userId: string },
    @Body() dto: CreateUnitDto,
  ): Promise<Unit> {
    return this.unitService.create({
      ...dto,
      owner: { id: player.userId },
    } as any); // ⚠️ временный cast, лучше сделать DTO без owner
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение юнита по ID (для дебага)' })
  @ApiParam({ name: 'id', type: String, description: 'UUID юнита' })
  @ApiResponse({ status: HttpStatus.OK, type: Unit })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Юнит не найден' })
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Unit> {
    return this.unitService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить юнита по ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Юнит удалён' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Не найден или не ваш',
  })
  async delete(
    @Param('id') id: string,
    @CurrentPlayer() player: { userId: string },
  ) {
    return this.unitService.delete(id, player.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('buy')
  @ApiOperation({ summary: 'Покупка нового юнита' })
  @ApiResponse({
    status: 201,
    description: 'Юнит куплен',
    schema: {
      example: {
        message: 'Юнит успешно куплен',
        unit: {
          id: 'e834f2a0-f3f2-4cf1-b202-d99887e5b789',
          type: 'INFANTRY',
          level: 1,
          amount: 1,
          owner: {
            id: 'd12fe531-8a9e-4f30-a55a-557d31cb9d4a',
            username: 'tester1',
          },
        },
        gold: 150,
        cost: 50,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно золота или не магазин',
  })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async buyUnit(@Request() req: any, @Body() dto: BuyUnitDto) {
    const playerId = req.user.authId;
    return this.unitService.buyUnitByPlayerId(playerId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/sell')
  @ApiOperation({ summary: 'Продать юнита по ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Юнит продан' })
  @ApiResponse({ status: 404, description: 'Не найден или не ваш' })
  async sellUnit(
    @Param('id') id: string,
    @CurrentPlayer() player: { userId: string },
  ) {
    return this.unitService.sellUnit(id, player.userId);
  }
}
