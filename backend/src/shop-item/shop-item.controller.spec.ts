import { Test, TestingModule } from '@nestjs/testing';
import { ShopItemController } from './shop-item.controller';
import { ShopItemService } from './shop-item.service';

describe('ShopItemController', () => {
  let controller: ShopItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopItemController],
      providers: [ShopItemService],
    }).compile();

    controller = module.get<ShopItemController>(ShopItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
