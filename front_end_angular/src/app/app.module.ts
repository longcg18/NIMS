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
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { Tree } from 'primeng/tree';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    AppComponent,
    NodeDataComponent
  ],
  imports: [
    ButtonModule,
    BrowserModule,
    AppRoutingModule,
    AngularTreeGridModule,
    TreeModule,
    PanelModule,
    CheckboxModule,
    TooltipModule,
    HttpClientModule,
    ToastModule,
    BrowserAnimationsModule,
    DialogModule
    
  ],
  providers: [NodeService, HttpClient, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
