import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterFlowComponent } from './water-flow.component';

describe('WaterFlowComponent', () => {
  let component: WaterFlowComponent;
  let fixture: ComponentFixture<WaterFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaterFlowComponent]
    });
    fixture = TestBed.createComponent(WaterFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
