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
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание новой локации' })
  @ApiResponse({ status: 201, description: 'Локация успешно создана' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех локаций' })
  @ApiResponse({ status: 200, description: 'Список локаций' })
  findAll() {
    return this.locationService.findAll();
  }

  @Get('arenas')
  @ApiOperation({ summary: 'Получить список арен (локации для битв)' })
  @ApiResponse({ status: 200, description: 'Список арен' })
  findBattleArenas() {
    return this.locationService.findBattleArenas();
  }

  @Get('shops')
  @ApiOperation({ summary: 'Получить список торговых постов (магазинов)' })
  @ApiResponse({ status: 200, description: 'Список магазинов' })
  findShops() {
    return this.locationService.findShops();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить локацию по ID' })
  @ApiParam({ name: 'id', description: 'ID локации' })
  @ApiResponse({ status: 200, description: 'Локация найдена' })
  @ApiResponse({ status: 404, description: 'Локация не найдена' })
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить локацию по ID' })
  @ApiParam({ name: 'id', description: 'ID локации' })
  @ApiResponse({ status: 200, description: 'Локация обновлена' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить локацию по ID' })
  @ApiParam({ name: 'id', description: 'ID локации' })
  @ApiResponse({ status: 200, description: 'Локация удалена' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }

  @Get(':id/destinations')
  @ApiOperation({ summary: 'Получить доступные направления из локации' })
  @ApiResponse({ status: 200, description: 'Список доступных направлений' })
  @ApiResponse({ status: 404, description: 'Локация не найдена' })
  @ApiParam({ name: 'id', description: 'ID локации' })
  getAvailableDestinations(@Param('id') id: string) {
    return this.locationService.getAvailableDestinations(id);
  }
}
