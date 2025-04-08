import { Test, TestingModule } from '@nestjs/testing';
import { PlayerAttributesService } from './player-attributes.service';

describe('PlayerAttributesService', () => {
  let service: PlayerAttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerAttributesService],
    }).compile();

    service = module.get<PlayerAttributesService>(PlayerAttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
