import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentPlayer } from 'src/auth/decorators/current-player.decorator';
import { PlayerAttributesService } from './player-attributes.service';
import { AssignAttributesDto } from './dto/assign-attributes.dto';
import { Player } from 'src/player/entities/player.entity';

@ApiTags('Player Attributes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('player-attributes')
export class PlayerAttributesController {
  constructor(
    private readonly playerAttributesService: PlayerAttributesService,
  ) {}

  @Post('assign')
  @ApiOperation({ summary: 'Распределить свободные очки характеристик' })
  @ApiBody({ type: AssignAttributesDto })
  @ApiResponse({ status: 200, description: 'Успешно', type: Player })
  @ApiResponse({ status: 400, description: 'Недостаточно очков или в бою' })
  async assign(
    @CurrentPlayer() player: { userId: string },
    @Body() dto: AssignAttributesDto,
  ) {
    return this.playerAttributesService.assignAttributes(player.userId, dto);
  }
}
