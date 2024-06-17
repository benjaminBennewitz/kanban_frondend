import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskServiceComponent } from './task-service.component';

describe('TaskServiceComponent', () => {
  let component: TaskServiceComponent;
  let fixture: ComponentFixture<TaskServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
