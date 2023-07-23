import { Component } from '@angular/core';
import { Device } from './device';
@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent {

  province_devices!: Device[];

  constructor() {

  }

  
}
