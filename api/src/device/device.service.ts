import { ConsoleLogger, Injectable } from '@nestjs/common';
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
        //console.log("LocationId:", _id);
        return await this.deviceRepo.find({where:{location_id: _id,}})
    }

    async findAllByProvinceId(_id): Promise<Device[]> {
        //console.log("Province id =", _id)
        return await this.deviceRepo.find({
            where: [
                {
                    province_id: _id,
                    network_class: "AGG_DISTRICT",
                },
                {
                    province_id: _id,
                    network_class: "CORE_PROVINCE",
                }
            ]
        })
    }

    async create(device: Device): Promise<Device> {
        return await this.deviceRepo.save(device)
    }
}
