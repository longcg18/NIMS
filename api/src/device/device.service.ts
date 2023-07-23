import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(Device)
        private readonly deviceRepo: Repository<Device>,
    ) {}

    async findAll(): Promise<Device[]> {
        return await this.deviceRepo.find()
    }

    async findOne(_id): Promise<Device> {
        return await this.deviceRepo.findOneBy({id: _id})
    }

    async findAllByLocationId(_id): Promise<Device[]> {
        console.log("LocationId:", _id);
        //const res = await this.deviceRepo.createQueryBuilder("device")
        //    .select()
        //    .where()
        return await this.deviceRepo.find({where:{location_id: _id,}})
    }

    async create(device: Device): Promise<Device> {
        return await this.deviceRepo.save(device)
    }
}
