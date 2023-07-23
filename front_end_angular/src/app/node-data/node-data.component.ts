import { Component, OnInit, Input } from '@angular/core';
import { NodeService } from 'src/service/nodeservice';
import { Location } from './location';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';

import { MessageService } from 'primeng/api';
import { Device } from '../device/device';

@Component({
  selector: 'app-node-data',
  templateUrl: './node-data.component.html',
  styleUrls: ['./node-data.component.css']
})
export class NodeDataComponent implements OnInit{

  @Input() node?: Node;

  locations: Location[] = [];

  flatArray!: any[];

  customArray!: any[];

  customTreeNodes!: TreeNode[];

  data!: TreeNode[] ;
  

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
    this.messageService.add({
      severity: "info",
      summary: "A node selected",
      detail: event.node.label
    })
    //this.devices = this.getNodeDevices(event.node.key);
    this.nodeService.getAllDevice(event.node.key).subscribe((res: any) => {
      this.devices = res;
    })
    console.log(event.node.key);
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

  private convertToTreeNode(customArray: any[]): TreeNode[] {
    const treeNodeMap = new Map<number, TreeNode>();

    // First pass: Create TreeNode objects and map them by their id.
    for (const item of customArray) {
      treeNodeMap.set(item.id, {
        data: { id: item.id, name: item.name }, // Modify this if you have additional data in your node.
        children: [],
      });
    }

    // Second pass: Connect the children to their parent nodes.
    for (const item of customArray) {
      if (item.parent_id !== null) {
        const parent = treeNodeMap.get(item.parent_id);
        const child = treeNodeMap.get(item.id);

        if (parent && child) {
          parent.children = parent.children || [];
          parent.children.push(child);
        }
      }
    }
    return customArray
      .filter((item) => item.parent_id === null)
      .map((item) => treeNodeMap.get(item.id)!);

  }

  private getTreeNodeChildren(parentItem: any, flatData: any[]): TreeNode[] {

    const children = flatData.filter((item) => item.parentId === parentItem.id);
    return this.convertToTreeNode(children);
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
  //if (childLocations.length > 0)
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

function totree(branches: any, node: any) {
  // if we don't have the parent yet
  if (!branches[node.parent]) {
    // create a dummy placeholder for now
    branches[node.parent] = {};
  }
  // store our node in its parent
  branches[node.parent][node.id] = node;
  // store our node in the full list
  // copy all added branches on possible placeholder
  branches[node.id] = Object.assign(node, branches[node.id]);

  return branches;
}

function convert_to_node(l: Location): any {
  const node = [{
    key: l.location_id,
    label: l.location_name,
    parent_id: l.parent_id,
    data: l.location_name
  }]
  return node;
}




