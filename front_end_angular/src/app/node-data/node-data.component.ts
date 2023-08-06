import { Component, DestroyRef, OnInit, Renderer2 } from '@angular/core';
import { NodeService } from 'src/service/nodeservice';
import { Location } from './location';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Device } from '../device/device';
import { Relation } from '../relation/relation';
import { Connection } from '../relation/connection';
import * as cytoscape from 'cytoscape';
import * as popper from 'cytoscape-popper';
import 'cytoscape-qtip';
import { group } from '@angular/animations';

@Component({
  selector: 'app-node-data',
  templateUrl: './node-data.component.html',
  styleUrls: ['./node-data.component.css']
})

export class NodeDataComponent implements OnInit{

  public cy!: cytoscape.Core;

  locations: Location[] = [];

  //customTreeNodes!: TreeNode[];

  data!: TreeNode[] ;
  
  //relations!: Relation[] ;

  connections!: Connection[];

  selected_node!: any;

  prtConnection!: Connection[];

  devices!: Device[];

  render!: Renderer2;
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
      let subscribleFlag = false;
      for (let device of coreDevices) {
        this.nodeService.getRelation(device.device_code).subscribe((responses) => {
          for (let res of responses) {
              if (res.node_type == "CORE_PROVINCE" && res.node_type_relation == "CORE_PROVINCE" && !addedElementIds.has(res.node_code) && !addedElementIds.has(res.node_code_relation)) {
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
              addedElementIds.add(this.prtConnection[0].node_code);
              addedElementIds.add(this.prtConnection[0].node_code_relation);
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

          var highlightedEdgeStyle = {
            'line-color': 'red',
          };

          var cytoPrtConnection = this.cy.edges('[type="PRT_PRT"]');
          for (let prt of cytoPrtConnection) {
            var source_node = prt.source();
            var target_node = prt.target();
            var dijkstra = this.cy.elements().dijkstra({
              root: '#' + source_node.data('id'),
              weight: this.cy.data('weight'),
              directed: false
            }).pathTo(target_node);
    
            var bfs = dijkstra;
            var x=0;
            var highlightNextEle = function(){
              var el=bfs[x];
              el.addClass('highlighted');
              if(x<bfs.length){
                x++;
                setTimeout(highlightNextEle, 500);
              }
              };
            highlightNextEle();
            this.cy.style().selector('.highlighted').style(highlightedEdgeStyle).update();
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

          this.cy.layout({
            name: 'breadthfirst',
            directed: false,
          }).run();




          
        });
      }

      

      function findPaths(src: cytoscape.NodeCollection,dest: cytoscape.NodeCollection) {
        let successors = src.successors();
        let predecessors = dest.predecessors();
        return successors.intersection(predecessors);
      }


      //console.log(this.prtConnection);
     // var cyPrtConnection = this.cy.nodes().data({
      //  type: "CORE_PROVINCE"
     // })


      

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
/*
      this.cy.on('tap', 'node', function (event) {
        var connectedEdges = event.target.successors()
        var i = 0;

        var highlightNextEle = function(){
            if( i < connectedEdges.length ){
                connectedEdges[i].addClass('highlighted');
                i++;
                highlightNextEle();
            }
        };
        highlightNextEle();
      });
*/

      var popper: any = null;
      var popperDiv = document.createElement('div');
      popperDiv.style.backgroundColor = '#fff'; 
      popperDiv.style.color = '#000'; 
      popperDiv.style.padding = '8px'; 
      popperDiv.style.border = '2px solid cyan';
      popperDiv.style.borderRadius = '4px';
      popperDiv.style.fontFamily = 'Montserrat, Arial, sans-serif'; 
      popperDiv.style.fontSize = '12px';
      
      this.cy.on('mouseover', 'node', (evt) => {
        const node = evt.target;
        if (popper) {
          popper.destroy();
          popper = null;
        }
      
        popperDiv.innerHTML = `Type: ${node.data('type')}<br>Location: ${this.devices.find(({device_code}) => device_code === node.data('id'))?.location_name}
          <br>Dept Code: ${this.devices.find(({device_code}) => device_code === node.data('id'))?.dept_code}`;
        document.body.appendChild(popperDiv);
      
        popper = this.cy.popper({
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
      
      this.cy.on('mouseout', 'node', () => {
        if (popper) {
          popper.destroy();
          popper = null;
        }
        if (popperDiv.parentNode) {
          popperDiv.parentNode.removeChild(popperDiv);
        }
      });


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
  }

  
  //getRing(start_prt: , end_prt: string): string[] {
  //  let successors = start_prt.succ
  //}
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

function findPaths(src: any, dest: any) {
  let successors = src.successors();
  let predecessors = dest.predecessors();
  return successors.intersection(predecessors);
}

/*
      var idList = [];
      var end_prt = this.prtConnection[0].node_code_relation;
      console.log(this.prtConnection);
      var bfs = this.cy.elements().bfs({
        roots: '#' + this.prtConnection[0].node_code,
        visit: function (v, e, u, i, depth) {
          idList[i] = v.id();
          if (v.data('id') == end_prt && depth > 1) {
            return true;
          } 
          return;
        },
        directed: false
      });
      var path = bfs.path;
      console.log(path);
*/
      //console.log(this.prtConnection);
      //var prtConnect = this.prtConnection[0];
      //console.log(this.prtConnection[0]);
      //console.log(prtConnect)

          /* 
          let root_node = this.cy.$id(this.prtConnection[0].node_code)
          console.log(root_node.data('id'));
          let target_node = this.cy.$id(this.prtConnection[0].node_code_relation)
          var dijkstra = this.cy.elements().dijkstra({
            root: '#' + root_node.data('id'),
            weight: this.cy.data('weight'),
            directed: false
          });
          var bfs = dijkstra.pathTo( this.cy.$(this.prtConnection[0].node_code_relation) );
          var x=0;
          var highlightNextEle = function(){
           var el=bfs[x];
            el.addClass('highlighted');
            if(x<bfs.length){
              x++;
              setTimeout(highlightNextEle, 500);
            }
             };
          highlightNextEle();
*/
          //console.log(findPaths(this.cy.$id(this.prtConnection[0].node_code), this.cy.$id(this.prtConnection[0].node_code_relation)));
/*
          var idList = [];
          var end_prt = this.prtConnection[0].node_code_relation;
          //console.log(this.prtConnection);
          var bfs = this.cy.elements().bfs({
            roots: '#' + this.prtConnection[0].node_code,
            visit: function (v, e, u, i, depth) {
              idList[i] = v.id();
              if (v.data('id') == end_prt && depth > 1) {
                return true;
              } 
              return;
            },
            directed: false
          });
          var path = bfs.path;
          //console.log(path); */

/*

                this.cy.add([
                  {
                    group: 'nodes',
                    data: {
                      id: res.node_code,
                      type: res.node_type.trim(),
                      interface: res.interface_port
                    },
                  },
                  {
                    group: 'nodes',
                    data: {
                      id: res.node_code_relation,
                      type: res.node_type_relation.trim(),
                      interface: res.interface_port_relation
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
*/
