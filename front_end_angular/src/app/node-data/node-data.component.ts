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
      let nodes: any = [];
      let edges: any [] = [];
      let relations_array: any[] = [];
      
      var cy = cytoscape({
        container: document.getElementById('cy'),   
      })
      
      var cyNodes:any = [];
      var cyEdges:any = [];
      for (let device of tempDevices) {
        this.nodeService.getRelation(device.device_code).subscribe((responses) => {

          for (let res of responses) {
            let node1: any = {
              data: {              
                id: res.node_code,
                //name: res.node_code
              }
            }

            cy.add([
              {
                group: 'nodes',
                data: {
                  id: res.node_code
                }
              },
                {group: 'nodes',
                data: {
                  id: res.node_code_relation
                }},
                {group: 'edges',
                data: {
                  source: res.node_code,
                  target: res.node_code_relation
                }}
            ])

            cy.layout({
              name: 'grid',
              avoidOverlap:true,
              avoidOverlapPadding:10
            }).run();
            nodes.push(node1);
            relations_array.push(node1);
            let cyNode1: cytoscape.NodeDefinition = {
              data: {
                id: res.node_code
              }
            }
            let cyNode2: cytoscape.NodeDefinition = {
              data: {
                id: res.node_code_relation
              }
            }

            let cyEdge: cytoscape.EdgeDefinition = {
              data: {
                source: res.node_code,
                target: res.node_code_relation
              }
            }

            //
            cyNodes.push({
              data: {
                id: res.node_code.toString(),
                name: res.node_type.toString(),
              }
            });
            cyNodes.push({
              data: {
                id: res.node_code_relation.toString(),
                name: res.node_type_relation.toString(),
              }
            });

            //
            cyEdges.push({
              data: {
                source: res.node_code.toString(),
                target: res.node_code_relation.toString(),
              }
            });
            let node2: any = {
              data:
              {
                id: res.node_code_relation,
              }
            }
            nodes.push(node2)
            relations_array.push(node2)
            let edge: any = {
              data: {
                id: res.node_code + res.node_code_relation,
                source: res.node_code,
                taret: res.node_code_relation
              }
            }
            edges.push(edge)
            relations_array.push(edge)
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
          }
        });

      }
      cy.style([ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': 'blue',
          'label': 'data(id)'
        }
      },])
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

const convertToCytoscapeElements = (array: any[]): ElementsDefinition => {
  const nodes: any = [];
  const edges: any = [];

  array.forEach((element) => {
    if ('source' in element && 'target' in element) {
      // This is an edge
      edges.push({
        data: {
          id: element.id,
          source: element.source,
          target: element.target,
         // label: element.label,
        },
      });
    } else {
      // This is a node
      nodes.push({
        data: {
          id: element.id,
          //label: element.label,
        },
      });
    }
  });

  return {
    nodes: nodes,
    edges: edges,
  };
};

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

function removeDuplicatesFromArray(array: any[]): any[] {
  const uniqueArray = array.filter((item, index) => {
    // Return the first occurrence of the item's index in the array
    return array.indexOf(item) === index;
    // If you prefer using 'includes', you can use the following line instead:
    // return !array.slice(0, index).includes(item);
  });

  return uniqueArray;
}

function uniqByObject<T>(array: T[]) {
  const result: T[] = [];
  for (const item of array) {
      if (!result.includes(item)) {
          result.push(item);
      }
  }
  return result;
}


            /*
            cy.add([
              {
                group: 'nodes',
                data: {
                  id: res.node_code
                }
              },
                {group: 'nodes',
                data: {
                  id: res.node_code_relation
                }},
                {group: 'edges',
                data: {
                  source: res.node_code,
                  target: res.node_code_relation
                }}
              
            ])*/