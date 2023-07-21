import { Controller, Get, Post, Body } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './location.entity';
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll(): Promise<Location[]> {
    return this.locationService.findAll();
  }

  @Post()
  create(@Body() location: Location) {
    return this.locationService.create(location);
  }
  
}
