import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GobackButtonComponent } from './goback-button.component';

describe('GobackButtonComponent', () => {
  let component: GobackButtonComponent;
  let fixture: ComponentFixture<GobackButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GobackButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GobackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
