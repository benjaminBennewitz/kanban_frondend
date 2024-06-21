import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerClickerComponent } from './timer-clicker.component';

describe('TimerClickerComponent', () => {
  let component: TimerClickerComponent;
  let fixture: ComponentFixture<TimerClickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerClickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimerClickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
