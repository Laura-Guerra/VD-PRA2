import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiUsageComponent } from './ai-usage.component';

describe('AiUsageComponent', () => {
  let component: AiUsageComponent;
  let fixture: ComponentFixture<AiUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiUsageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
