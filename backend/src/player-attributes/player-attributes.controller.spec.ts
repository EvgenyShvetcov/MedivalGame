import { Test, TestingModule } from '@nestjs/testing';
import { PlayerAttributesController } from './player-attributes.controller';
import { PlayerAttributesService } from './player-attributes.service';

describe('PlayerAttributesController', () => {
  let controller: PlayerAttributesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerAttributesController],
      providers: [PlayerAttributesService],
    }).compile();

    controller = module.get<PlayerAttributesController>(PlayerAttributesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
