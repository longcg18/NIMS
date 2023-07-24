import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './device.entity';
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
    
  @Get()
  findAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  @Get('/location/' + ':id') 
  findByLocationId(@Param('id')id :string): Promise<Device[]> {
    return this.deviceService.findAllByLocationId(id);
  }

  @Get('/province/' + ':id')
  findByProvinceId(@Param('id')id: string): Promise<Device[]> {
    return this.deviceService.findAllByProvinceId(id);
  }
}

