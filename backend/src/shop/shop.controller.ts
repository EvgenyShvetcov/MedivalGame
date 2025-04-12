import { Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/types';

@ApiTags('Shop')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все магазины' })
  findAll() {
    return this.shopService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить магазин по ID' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @Get('by-location/:locationId')
  @ApiOperation({ summary: 'Получить магазин по ID локации' })
  @ApiParam({ name: 'locationId' })
  findByLocation(@Param('locationId') locationId: string) {
    return this.shopService.findByLocation(locationId);
  }

  @Post(':shopItemId/buy')
  @ApiOperation({ summary: 'Купить товар из магазина' })
  @ApiParam({ name: 'shopItemId' })
  buy(@Param('shopItemId') id: string, @Req() req: RequestWithUser) {
    return this.shopService.buy(id, req.user.id);
  }
}
