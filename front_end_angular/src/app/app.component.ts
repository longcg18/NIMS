import { Component, OnInit } from '@angular/core';
import { TreeNode} from 'primeng/api'
import { NodeService } from 'src/service/nodeservice';
import { NodeDataComponent } from './node-data/node-data.component';
import { CytoscapeOptions, Core} from 'cytoscape';
import * as cytoscape from 'cytoscape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NetMap';
}
