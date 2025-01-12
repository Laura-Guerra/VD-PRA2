import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolinChartComponent } from './violin-chart.component';

describe('ViolinChartComponent', () => {
  let component: ViolinChartComponent;
  let fixture: ComponentFixture<ViolinChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolinChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViolinChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
