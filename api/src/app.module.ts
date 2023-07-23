import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationModule } from './location/location.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host: 'localhost',
      port: +'3307',
      username: 'root',
      password: '20021387',
      database: 'nism',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    
    
    
    LocationModule,
    
    
    
    DeviceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
