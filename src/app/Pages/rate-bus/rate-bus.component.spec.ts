import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateBusComponent } from './rate-bus.component';

describe('RateBusComponent', () => {
  let component: RateBusComponent;
  let fixture: ComponentFixture<RateBusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateBusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
