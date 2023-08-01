import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Relation } from './relation.entity';

@Injectable()
export class RelationService {
    constructor(
        @InjectRepository(Relation)
        private readonly relaRepo: Repository<Relation>,
    ) {}

    async findAll(): Promise<Relation[]> {
        return await this.relaRepo.find();
    }

    async findByStartDevice(code): Promise<Relation[]> {
        let tempRelations =  await this.relaRepo.find({
            where: [
                {
                    node_code: code,
                    node_type_relation: "AGG_DISTRICT",
                },
                {
                    node_code: code,
                    node_type_relation: "CORE_PROVINCE",
                }
            ]
        });

        return tempRelations;
    }
}
