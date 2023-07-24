import { Controller, Get, Param } from '@nestjs/common';
import { RelationService } from './relation.service';
import { Relation } from './relation.entity';

@Controller('relation')
export class RelationController {
  constructor(private readonly relationService: RelationService) {}

  @Get()
  findAll(): Promise<Relation[]> {
    return this.relationService.findAll();
  }

  @Get('/start/' + ':code')
  findByStartDevice(@Param('code')code: string): Promise<Relation[]> {
    return this.relationService.findByStartDevice(code);
  }
}
