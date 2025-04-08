import { PartialType } from '@nestjs/swagger';
import { CreatePlayerAttributeDto } from './create-player-attribute.dto';

export class UpdatePlayerAttributeDto extends PartialType(CreatePlayerAttributeDto) {}
