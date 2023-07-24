import { Component } from '@angular/core';
import { Device } from '../device/device';
import { NodeService } from 'src/service/nodeservice';
import { Relation } from './relation';

@Component({
  selector: 'app-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.css']
})
export class RelationComponent {

    start_device!: Device;

    end_device!: Device[];

    relation !: Relation;

    constructor(private nodeService: NodeService) {}
/*
    getDeviceRelation(start_device_code: any): Relation {
      let relation!: Relation;
      this.nodeService.getRelation(start_device_code).subscribe((responses) => {
        for (let res of responses) {
          relation.start_device_code = start_device_code;
          relation.start_device_int_port = res.start_device_int_port;
          relation.start_device_type = res.start_device_type;

          relation.relation_id.push(res.relation_id);
          relation.relation_key.push(res.relation_key);

          relation.end_device_code.push(res.end_device_code);
          relation.end_device_int_port.push(res.end_device_int_port);
          relation.end_device_type.push(res.end_device_type);
        }
      })
      return relation;
    }
    */
}
