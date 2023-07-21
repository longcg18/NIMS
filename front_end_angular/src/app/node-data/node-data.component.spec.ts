import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeDataComponent } from './node-data.component';

describe('NodeDataComponent', () => {
  let component: NodeDataComponent;
  let fixture: ComponentFixture<NodeDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeDataComponent]
    });
    fixture = TestBed.createComponent(NodeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
