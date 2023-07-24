import { Component, OnInit, Input } from '@angular/core';
import { NodeService } from 'src/service/nodeservice';
import { Location } from './location';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';

import { MessageService } from 'primeng/api';
import { Device } from '../device/device';
import { Relation } from '../relation/relation';
import { DeviceComponent } from '../device/device.component';
import { Connection } from '../relation/connection';
import * as cytoscape from 'cytoscape';

//declare var cytoscape!: cytoscape;
@Component({
  selector: 'app-node-data',
  templateUrl: './node-data.component.html',
  styleUrls: ['./node-data.component.css']
})

export class NodeDataComponent implements OnInit{

  @Input() node?: Node;

  public cy: cytoscape.Core | undefined;

  locations: Location[] = [];

  flatArray!: any[];

  customArray!: any[];

  customTreeNodes!: TreeNode[];

  data!: TreeNode[] ;
  
  relations!: Relation[] ;

  connections!: Connection[];

  selected_node!: any;

  devices!: Device[];

  constructor(
    private nodeService: NodeService, private messageService: MessageService
  ) {}

  getNodeData(): void {
    const id = Number()
  }

  ngOnInit(): void {
    this.nodeService.getAll().subscribe((res: any) => {
      this.locations = res;
      let tempLocations: Location[] = res;
      let temp: any = [];
      this.locations.forEach((i) => {
        let temp2: TreeNode = {
          data: {
            label: i.location_name,
            level: i.location_level
          },
          label: i.location_code + " " + i.location_name,
          key: i.location_id,
          children: <TreeNode[]> getChildrenLocation(i.location_id, tempLocations),
        } 
        if (temp2.data.level == 1) {
          temp.push(temp2)
        }
      })
      this.data = temp;
    })
  }

  expandAll() {
    this.data.forEach((node) => {
        this.expandRecursive(node, true);
    });
  }

  collapseAll() {
      this.data.forEach((node) => {
          this.expandRecursive(node, false);
      });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
      node.expanded = isExpand;
      if (node.children) {
          node.children.forEach((childNode) => {
              this.expandRecursive(childNode, isExpand);
          });
      }
  }
  

  printSelectedNode(event: any) {
    let tempDevices: Device[] = [];
    this.messageService.add({
      severity: "info",
      summary: "A node selected",
      detail: event.node.label
    })
    //this.devices = this.getNodeDevices(event.node.key);
    this.nodeService.getAllDevice(event.node.key).subscribe((res: any) => {
      this.devices = res;
      tempDevices = this.devices;
      let connections: Connection[] = [];
      let data: any [] = [];
      let edges: any [] = [];
      for (let device of tempDevices) {
        this.nodeService.getRelation(device.device_code).subscribe((responses) => {
          for (let res of responses) {
            let node1 = {
              data:
              {              id: res.node_code,
              type: 'node',
              name: res.node_code}
            }
            data.push(node1);
            let node2 = {
              data:
              {id: res.node_code_relation,
              type: 'node',
              name: res.node_code_relation}
            }
            data.push(node2)
            let edge = {
              id: res.relation_id,
              source: res.node_code,
              taret: res.node_code_relation,
            }
            edges.push(edge)
            let connection: Connection = {
              node_code: res.node_code,
              interface_port: res.interface_port,
              node_type: res.node_type,
              
              relation_id: res.relation_id,
              relation_key: res.relation_key,

              node_code_relation: res.node_code_relation,
              node_type_relation: res.node_type_relation,
              interface_port_relation: res.interface_port_relation,
              
            }
            connections.push(connection);
            console.log(connection);  
          }
        });
      }

      let graph: any = {
        nodes: data,
        edges: edges,
      }
      this.cy = cytoscape({
        container: document.getElementById('cy'),
        elements: graph
      })
      //console.log(this.devices)
    })  
    //console.log(event.node.key);
    console.log(tempDevices);

  }
  
  getNodeDevices(location_id: any): Device[] {
    let subdev: Device[] = [];
    
    this.nodeService.getAllDevice(location_id).subscribe((res: any) => {
      subdev = res;
      console.log(subdev);
      return subdev;
    })
    return subdev;
  }

  closeSelectedNode(event: any) {
    this.messageService.add({
      severity: "info",
      summary: "A node unselected",
      detail: event.node.label
    })
    console.log(event.node.label)
  }

  drawRelation() {
    return this.relations;
  }

  getDeviceRelation(start_device_code: string): Relation {
    console.log(start_device_code);
    let relation!: Relation;
    this.nodeService.getRelation(start_device_code).subscribe((responses) => {
      for (let res of responses) {
        relation.start_device_code = res.node_code;
        relation.start_device_int_port = res.interface_port;
        relation.start_device_type = res.node_type;

        relation.relation_id.push(res.relation_id);
        relation.relation_key.push(res.relation_key);

        relation.end_device_code.push(res.node_code_relation);
        relation.end_device_int_port.push(res.interface_port_relation);
        relation.end_device_type.push(res.node_type_relation);
      }
    })
    return relation;
  }
}

function getChildrenLocation(location_id: any, locations: any[]): TreeNode[] {
  let childLocations: TreeNode[] = [];
  locations.forEach(function(i) {
    if(i.parent_id == location_id) {
      let childNode: TreeNode = {
        key: i.location_id,
        label: i.location_code + " " + i.location_name,
        data: {
          level: i.location_level,
        },
        children: <TreeNode[]> getChildrenLocation(i.location_id, locations)
      }
      if (childNode.data.level < 4)
        childLocations.push(childNode)
    }
  })
  return childLocations
}

function getParentLocation(parent_id: string, locations: any[]): TreeNode {
  if (parent_id != null) {
    let tempLocation: Location = locations.find((obj) => obj.location_id === parent_id)
    let a: TreeNode = {
      key: tempLocation.location_id,
      label: tempLocation.location_name,
      data: {

      }
    }
    return a;
  } else {
    let nullTreeNode: TreeNode = {} 
    return nullTreeNode;
  }

}
