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


import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeviceComponent } from './device/device.component';


@NgModule({
  declarations: [
    AppComponent,
    NodeDataComponent,
    DeviceComponent
  ],
  imports: [
    ButtonModule,
    BrowserModule,
    AppRoutingModule,
    AngularTreeGridModule,
    TreeModule,
    CheckboxModule,

    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule
  ],
  providers: [NodeService, HttpClient, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
