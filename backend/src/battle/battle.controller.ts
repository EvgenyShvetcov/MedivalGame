import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BattleService } from './battle.service';
import { MatchmakingService } from './matchmaking.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateBattleDto } from './dto/create-battle.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentPlayer } from 'src/auth/decorators/current-player.decorator';
import { ChooseUnitDto } from './dto/choose-unit.dto';
import { Battle } from './entities/battle.entity';

@ApiTags('Battle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('battle')
export class BattleController {
  constructor(
    private readonly battleService: BattleService,
    private readonly matchmakingService: MatchmakingService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой битвы' })
  @ApiResponse({ status: 201, description: 'Битва создана', type: Battle })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  create(
    @CurrentPlayer() player: { userId: string },
    @Body() dto: CreateBattleDto,
  ) {
    return this.battleService.create(dto, player.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Список всех битв' })
  @ApiResponse({ status: 200, description: 'Список битв', type: [Battle] })
  findAll() {
    return this.battleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение битвы по ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Битва найдена', type: Battle })
  findOne(@Param('id') id: string) {
    return this.battleService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление битвы по ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Битва удалена' })
  remove(@Param('id') id: string) {
    return this.battleService.remove(id);
  }

  @Post(':id/choose-unit')
  @ApiOperation({ summary: 'Выбор юнита для текущего раунда боя' })
  @ApiParam({ name: 'id', description: 'ID битвы' })
  @ApiBody({ type: ChooseUnitDto })
  @ApiResponse({ status: 200, description: 'Юнит выбран' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async chooseUnit(
    @Param('id') battleId: string,
    @CurrentPlayer() player: { userId: string },
    @Body() dto: ChooseUnitDto,
  ) {
    return this.battleService.chooseUnit(battleId, player.userId, dto.unitId);
  }

  @Post(':id/process-turn')
  @ApiOperation({ summary: 'Обработка хода боя (сравнение юнитов)' })
  @ApiParam({ name: 'id', description: 'ID битвы' })
  @ApiResponse({ status: 200, description: 'Ход обработан', type: Battle })
  @ApiResponse({ status: 404, description: 'Битва не найдена' })
  async processTurn(@Param('id') battleId: string) {
    return this.battleService.processBattleTurn(battleId);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Получить логи битвы по ID' })
  @ApiParam({ name: 'id', description: 'ID битвы' })
  @ApiResponse({ status: 200, description: 'Список логов' })
  async getBattleLogs(@Param('id') battleId: string) {
    return this.battleService.getLogsForBattle(battleId);
  }

  @Post('search')
  @ApiOperation({ summary: 'Встать в очередь поиска битвы' })
  async searchForBattle(@CurrentPlayer() player: { userId: string }) {
    const foundBattle = await this.matchmakingService.joinQueue(player.userId);
    return foundBattle || { message: 'Поиск запущен' };
  }

  @Post('cancel-search')
  @ApiOperation({ summary: 'Отменить поиск битвы' })
  async cancelSearch(@CurrentPlayer() player: { userId: string }) {
    this.matchmakingService.leaveQueue(player.userId);
    return { message: 'Поиск отменён' };
  }

  @Post('with-bot')
  @ApiOperation({ summary: 'Начать бой против бота' })
  async startBotBattle(@CurrentPlayer() player: { userId: string }) {
    return this.battleService.createBotBattle(player.userId);
  }
}
