import { TreeNode } from 'primeng/api';
import { DefaultIterableDiffer, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,of} from 'rxjs';
import { Location } from 'src/app/node-data/location';
import { Device } from 'src/app/node-data/device';    
import { Connection } from 'src/app/node-data/connection';

const httpOptions ={
    headers:new HttpHeaders({'Content-Type':'Application/json'})
  }

const apiUrl = 'http://localhost:3000/location';

const getAllDevice = 'http://localhost:3000/device/province/'

const getAllRelation = 'http://localhost:3000/relation/start/'

@Injectable({
    providedIn: 'root'
})
export class NodeService {

    constructor(private httpClient: HttpClient) {

    }

    getAll():Observable<Location[]>{
      return this.httpClient.get<Location[]>(apiUrl).pipe();
      }

    getAllDevice(location_id: string): Observable<Device[]> {
      //console.log(getAllDevice + location_id);
      return this.httpClient.get<Device[]>(getAllDevice + location_id).pipe();
    }
    
    async getDevice(location_id: string): Promise<Observable<Device[]>> {
      const res =  await this.httpClient.get<Device[]>(getAllDevice + location_id).pipe();
      return res;
    }

    async getConnection(start_device_code: string): Promise<Observable<Connection[]>> {
      const res = await this.httpClient.get<Connection[]>(getAllRelation + start_device_code).pipe();
      return res;
    }

    getRelation(start_device_code: string): Observable<Connection[]> {
      return this.httpClient.get<Connection[]>(getAllRelation + start_device_code).pipe();
    }
};