import { TreeNode } from 'primeng/api';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,of} from 'rxjs';
import { Location } from 'src/app/node-data/location';
import { Device } from 'src/app/device/device';    
import { DeviceComponent } from 'src/app/device/device.component';

const httpOptions ={
    headers:new HttpHeaders({'Content-Type':'Application/json'})
  }

const apiUrl = 'http://localhost:3000/location';

const getAllDevice = 'http://localhost:3000/device/location/'

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

    getAllDevice(location_id: string): Observable<Device[]> {
      console.log(getAllDevice + location_id);
        return this.httpClient.get<Device[]>(getAllDevice + location_id).pipe()
    }
    
};