import { Component, OnInit } from '@angular/core';
import { NodeService } from 'src/service/nodeservice';
import { Location } from './location';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Device } from './device';
//import { Relation } from '../relation/relation';
import { Connection } from './connection';
import * as cytoscape from 'cytoscape';
import * as popper from 'cytoscape-popper';
import 'cytoscape-qtip';
//import { group } from '@angular/animations';

@Component({
  selector: 'app-node-data',
  templateUrl: './node-data.component.html',
  styleUrls: ['./node-data.component.css']
})

export class NodeDataComponent implements OnInit{

  public cy!: cytoscape.Core;
  locations: Location[] = [];
  data!: TreeNode[] ;
  connections!: Connection[];
  selected_node!: any;
  prtConnection!: Connection[];
  devices!: Device[];
  constructor(
    private nodeService: NodeService, private messageService: MessageService
  ) {}

  ngOnInit(): void {
    cytoscape.use(popper)
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
  
  changeLayoutToCose() {
    this.cy.layout({
      name: 'cose',
      animate: true,
    }).run();
  }

  changeLayoutToGrid() {
    this.cy.layout({
      name: 'grid',
      animate: true
    }).run();
  }

  changeLayoutToCircle() {
    this.cy.layout({
      name: 'circle',
      animate: true,
    }).run()
  }

  changeLayoutToConcentric() {
    this.cy.layout({
      name: 'concentric',
      animate: true,
    }).run()
  }

  printSelectedNode(event: any) {
    let coreDevices: Device[] = [];
    this.messageService.add({
      severity: "info",
      summary: "Province selected:",
      detail: event.node.label
    });
    this.prtConnection = [];
    let otherConnection: Connection[] = [];
    this.nodeService.getAllDevice(event.node.key).subscribe((res: any) => {
      this.devices = res;
      coreDevices = this.devices;
      this.cy = cytoscape({
        container: document.getElementById('cy'),
      })
      var addedElementIds = new Set();
      var addedEdges = new Set();
      for (let device of coreDevices) {
        this.nodeService.getRelation(device.device_code).subscribe((responses) => {
          
          for (let res of responses) {
              if (res.node_type == "CORE_PROVINCE" && res.node_type_relation == "CORE_PROVINCE" 
                && !addedElementIds.has(res.node_code) && !addedElementIds.has(res.node_code_relation)) {
                this.prtConnection.push(res);
              } else if( (res.node_type == "AGG_DISTRICT" && res.node_type_relation == "CORE_PROVINCE") ||
                (res.node_type == "CORE_PROVINCE" && res.node_type_relation == "AGG_DISTRICT")) {
                otherConnection.push(res);
              }
          }  
          for (let prt of this.prtConnection) {
            if (!addedElementIds.has(prt.node_code)) {
              this.cy.add([
                {
                  group: 'nodes',
                  data: {
                    id: prt.node_code,
                    type: prt.node_type,
                    interface: prt.interface_port
                  }
                },
                {
                  group: 'nodes',
                  data: {
                    id: prt.node_code_relation,
                    type: prt.node_type_relation,
                    interface: prt.interface_port_relation
                  }
                },
              ])
              addedElementIds.add(prt.node_code);
              addedElementIds.add(prt.node_code_relation);
            }
          }

          for (let res of otherConnection) {
            var edgeId = `${res.node_code}-${res.node_code_relation}`;
            var revertedEdgeId = `${res.node_code_relation}-${res.node_code}`;
            if (!addedElementIds.has(res.node_code)) {
              this.cy.add([
                {
                  group: 'nodes',
                  data: {
                    id: res.node_code,
                    type: res.node_type.trim(),
                    interface: res.interface_port
                  },
                },
              ])
              addedElementIds.add(this.prtConnection[0].node_code);
            }
            if (!addedElementIds.has(res.node_code_relation)) {
              this.cy.add([
                {
                  group: 'nodes',
                  data: {
                    id: res.node_code_relation,
                    type: res.node_type_relation.trim(),
                    interface: res.interface_port_relation
                  }
                }
              ])
              addedElementIds.add(this.prtConnection[0].node_code_relation);
            }
            if (!addedEdges.has(edgeId) && !addedEdges.has(revertedEdgeId)) {
              this.cy.add([
                {
                  group: 'edges',
                  data: {
                    id: edgeId,
                    source: res.node_code,
                    target: res.node_code_relation
                  }
                }
              ])
              addedEdges.add(edgeId);
            }
          }
          
          for (let res of this.prtConnection) {
            var edgeId = `${res.node_code}-${res.node_code_relation}`;
            var revertedEdgeId = `${res.node_code_relation}-${res.node_code}`;
            if (!addedEdges.has(edgeId) && !addedEdges.has(revertedEdgeId)) {
              this.cy.add([
                {
                  group: 'edges',
                  data: {
                    id: edgeId,
                    source: res.node_code,
                    target: res.node_code_relation,
                    type: "PRT_PRT"
                  }
                }
              ])
              addedEdges.add(edgeId);
            }
          }
          findAllAvailablePath(this.cy);
          var highlightedEdgeStyle = {
            'line-color': 'red',
          };
          this.cy.style().selector('.highlighted').style(highlightedEdgeStyle).update();
          this.cy.layout({
            name: 'breadthfirst',
            directed: false,
          }).run();
        });
      }

      this.cy.style([ 
        {
          selector: 'node',
          style: {
            'label': 'data(id)',
            'background-clip':'none',
            'background-fit':'cover',
            'background-opacity': 0, 
            'border-width': 0, 
            'text-valign': 'bottom',
            'border-color': '#ffffff'
          }
        },
        {
          selector: 'node[type="AGG_DISTRICT"]',
          style: {
            'background-image':'../assets/server.png',
          },
        },
        {
          selector: 'node[type="CORE_PROVINCE"]',
          style: {
            'background-image':'../assets/switch.png',
          },
        },
      ]);
      
      this.cy.on('tap', 'node', (evt) => {
        this.messageService.add({
          severity: "info",
          summary: "Device selected:",
          detail: "Type: " + evt.target.data('type') + " Location: " + this.devices.find(({device_code}) => device_code === evt.target.data('id'))?.path_name,
        })
      });

      this.cy.on('tap', 'edge', (evt) => {
        this.messageService.add({
          severity: "info",
          summary: "Edge selected:",
          detail: "Between: " + evt.target.data('source') + " and: " + evt.target.data('target'),
        })
      });
      popperDefine(this.cy, this.devices);
    })
  }
}

function findAllAvailablePath(cy: cytoscape.Core): void {
  var cytoPrtConnection = cy.edges('[type="PRT_PRT"]');
  for (let prt of cytoPrtConnection) {
    var source_node = prt.source();
    var target_node = prt.target();

    const allpaths = findAllWays(source_node, target_node);
    markAllPaths(cy, allpaths)
  }
}

function findAllWays(source_node: cytoscape.NodeCollection, target_node: cytoscape.NodeCollection): cytoscape.NodeCollection[][] {
  var paths: cytoscape.NodeCollection[][] = [];
  var visitedNode: Record<string, boolean> = {};
  function dfs(currentNode: cytoscape.NodeCollection, currentPath: cytoscape.NodeCollection[]) {
    visitedNode[currentNode.data('id')] = true;
    currentPath.push(currentNode);

    if (currentNode.data('id') === target_node.data('id')) {
      paths.push([...currentPath]);
    } else {
      currentNode.neighborhood().each(neighbor => {
        if (!visitedNode[neighbor.data('id')]) {
          dfs(neighbor, [...currentPath]);
        }
      })
    }

    visitedNode[currentNode.data('id')] = false;
  }
  dfs(source_node, []);
  return paths;
}

function markAllPaths(cy: any, paths: cytoscape.NodeCollection[][]) {
  paths.forEach(path => {
    for (let i = 0; i < path.length - 1; i++) {
      path[i].edgesWith(path[i + 1]).addClass('highlighted');
    }
  });
}

function popperDefine(cy: cytoscape.Core, devices: Device[]): void {
  var popper: any = null;
  var popperDiv = document.createElement('div');
  popperDiv.style.backgroundColor = '#fff'; 
  popperDiv.style.color = '#000'; 
  popperDiv.style.padding = '8px'; 
  popperDiv.style.border = '2px solid cyan';
  popperDiv.style.borderRadius = '4px';
  popperDiv.style.fontFamily = 'Montserrat, Arial, sans-serif'; 
  popperDiv.style.fontSize = '12px';
  
  cy.on('mouseover', 'node', (evt) => {
    const node = evt.target;
    if (popper) {
      popper.destroy();
      popper = null;
    }
  
    popperDiv.innerHTML = `Type: ${node.data('type')}<br>Location: ${devices.find(({device_code}) => device_code === node.data('id'))?.location_name}
      <br>Dept Code: ${devices.find(({device_code}) => device_code === node.data('id'))?.dept_code}`;
    document.body.appendChild(popperDiv);
  
    popper = cy.popper({
      content: () => popperDiv,
      renderedPosition: () => ({ x: node.renderedPosition().x, y: node.renderedPosition().y - 12}),
      popper: {
        placement: 'top',  
        modifiers: [
          {
            name: 'flip',
            enabled: false,
          },
      ],
        strategy: 'absolute',
      },
    });
  });
  
  cy.on('mouseout', 'node', () => {
    if (popper) {
      popper.destroy();
      popper = null;
    }
    if (popperDiv.parentNode) {
      popperDiv.parentNode.removeChild(popperDiv);
    }
  });
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