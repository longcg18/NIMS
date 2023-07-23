import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularTreeGridModule } from 'angular-tree-grid';
import { TreeModule } from 'primeng/tree';

import { CheckboxModule } from 'primeng/checkbox' ;
import { NodeService } from 'src/service/nodeservice';
import { NodeDataComponent } from './node-data/node-data.component';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';

import { ButtonModule } from 'primeng/button' 
<<<<<<< Updated upstream
=======
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceComponent } from './device/device.component';
>>>>>>> Stashed changes

@NgModule({
  declarations: [
    AppComponent,
<<<<<<< Updated upstream
    NodeDataComponent
  ],
  imports: [
=======
    NodeDataComponent,
    DeviceComponent
  ],
  imports: [
    ButtonModule,
>>>>>>> Stashed changes
    BrowserModule,
    AppRoutingModule,
    AngularTreeGridModule,
    TreeModule,
    CheckboxModule,
<<<<<<< Updated upstream
    HttpClientModule
  ],
  providers: [NodeService, HttpClient],
=======
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule
  ],
  providers: [NodeService, HttpClient, MessageService],
>>>>>>> Stashed changes
  bootstrap: [AppComponent]
})
export class AppModule { }
