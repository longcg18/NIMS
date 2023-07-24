import { Component } from '@angular/core';
import { Device } from './device';
import { NodeService } from 'src/service/nodeservice';
import { Relation } from '../relation/relation';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent {

  device!: Device;

  relation!: Relation;


  constructor(private nodeService: NodeService) {

  }
/*
  getDeviceRelation(): Relation {
    let relation!: Relation;
    this.nodeService.getRelation(this.device.device_code).subscribe((responses) => {
      for (let res of responses) {
        relation.start_device_code = res.start_device_code;
        relation.start_device_int_port = res.start_device_int_port;
        relation.start_device_type = res.start_device_type;

        relation.relation_id.push(res.relation_id);
        relation.relation_key.push(res.relation_key);

        relation.end_device_code.push(res.end_device_code);
        relation.end_device_int_port.push(res.end_device_int_port);
        relation.end_device_type.push(res.end_device_type);
      }
    })

    this.relation = relation;
    return relation;
  }
*/
  printDeviceRelation() {
    console.log("FROM" + this.device.device_code + "TO" + this.relation);
  }
  
}
