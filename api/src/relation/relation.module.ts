import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { Relation } from './relation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Relation])],
  controllers: [RelationController],
  providers: [RelationService],
  exports: [RelationService]
})
export class RelationModule {}
