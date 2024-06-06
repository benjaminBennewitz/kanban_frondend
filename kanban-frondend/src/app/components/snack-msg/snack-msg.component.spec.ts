import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackMsgComponent } from './snack-msg.component';

describe('SnackMsgComponent', () => {
  let component: SnackMsgComponent;
  let fixture: ComponentFixture<SnackMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackMsgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnackMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
