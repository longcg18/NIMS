import { TreeNode } from 'primeng/api';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable,of} from 'rxjs';
import { Location } from 'src/app/node-data/location';
    
const httpOptions ={
    headers:new HttpHeaders({'Content-Type':'Application/json'})
  }

const apiUrl = 'http://localhost:3000/location';

@Injectable({
    providedIn: 'root'
})
export class NodeService {

    constructor(private httpClient: HttpClient) {

    }

    getAll():Observable<Location[]>{
        return this.httpClient.get<Location[]>(apiUrl).pipe(
        )
      }

    data:any [] = []

    getTreeNodesData() {
        return <TreeNode[]>this.data;
    }


    getTreeNodes() {
        return Promise.resolve(this.getTreeNodesData());
    }

    getFiles() {
        return Promise.resolve(this.getTreeNodesData());
    }
    
};