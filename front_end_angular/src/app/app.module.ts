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

@NgModule({
  declarations: [
    AppComponent,
    NodeDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularTreeGridModule,
    TreeModule,
    CheckboxModule,
    HttpClientModule
  ],
  providers: [NodeService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
