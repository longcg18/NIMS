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
import { ElementsDefinition } from 'cytoscape';
import { group } from '@angular/animations';

import { PanelModule } from 'primeng/panel';

//declare var cytoscape!: cytoscape;
@Component({
  selector: 'app-node-data',
  templateUrl: './node-data.component.html',
  styleUrls: ['./node-data.component.css']
})

export class NodeDataComponent implements OnInit{

  @Input() node?: Node;

  public cy?: cytoscape.Core;

  locations: Location[] = [];

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
          label: i.location_name,
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
    let coreDevices: Device[] = [];
    this.messageService.add({
      severity: "info",
      summary: "Node selected:",
      detail: event.node.label
    })
    this.nodeService.getAllDevice(event.node.key).subscribe((res: any) => {
      this.devices = res;
      coreDevices = this.devices;
      var cy = cytoscape({
        container: document.getElementById('cy'),   
      })
      console.log(coreDevices)
      for (let device of coreDevices) {
        this.nodeService.getRelation(device.device_code).subscribe((responses) => {
          
          for (let res of responses) {
            if (res.node_type == "CORE_PROVINCE" && res.node_type_relation == "AGG_DISTRICT") {            
              cy.add([
                {
                  group: 'nodes',
                  data: {
                    id: res.node_code,
                    type: res.node_type.trim()
                  },
                },
                {
                  group: 'nodes',
                  data: {
                    id: res.node_code_relation,
                    type: res.node_type_relation.trim()
                  }
                },
                {
                  group: 'edges',
                  data: {
                    source: res.node_code,
                    target: res.node_code_relation
                  }
                }
              ])
            }
            cy.layout({
              name:'cose'
            }).run();
          }
        });
      }

      cy.style([ 
        {
          selector: 'node[type="AGG_DISTRICT"]',
          style: {
            'background-color': 'blue',
            'label': 'data(id)'
          }
        },
        {
          selector: 'node[type="CORE_PROVINCE"]',
          style: {
            'background-color': 'pink',
            'label': 'data(id)'
          }
        },
        {
          selector: 'node[type="SITE_ROUTER"]',
          style: {
            'background-color': 'yellow',
            'label': 'data(id)'
          }
        },
        {
          selector: 'node[type="CORE_AREA"]',
          style: {
            'background-color': 'red',
            'label': 'data(id)'
          }
        }
      
      ])

      cy.on('tap', 'node', function (evt) {
        console.log(evt.target.data('id'), evt.target.data('type'))
      })
    })  
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
}

function getChildrenLocation(location_id: any, locations: any[]): TreeNode[] {
  let childLocations: TreeNode[] = [];
  locations.forEach(function(i) {
    if(i.parent_id == location_id) {
      let childNode: TreeNode = {
        key: i.location_id,
        label: i.location_name,
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
