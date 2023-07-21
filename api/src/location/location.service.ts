import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private readonly locationRepo: Repository<Location>,
    ) {}

    async findAll(): Promise<Location[]> {
        return await this.locationRepo.find();
    }

    async findOne(_id): Promise<Location> {
        return await this.locationRepo.findOneBy({id: _id});
    }

    async findOneByName(_name): Promise<Location> {
        return await this.locationRepo.findOneBy({location_name: _name});
    }

    async create(location: Location): Promise<Location> {
        return await this.locationRepo.save(location);
    } 
}
