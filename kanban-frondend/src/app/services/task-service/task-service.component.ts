// src/app/services/task/task.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Task {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  date: Date;
  prio: string;
  done: Boolean;
  status: 'urgent' | 'todo' | 'inProgress' | 'done';
}

@Injectable({
  providedIn: 'root',
})
export class TaskServiceComponent {
  urgent: Task[] = [];

  todo: Task[] = [
    {
      id: 1,
      title: 'Start with Angular',
      subtitle: 'Read documentation and differences',
      content:
        'Many new functions on Angular 18: Material 3, deferrable views and built-in controls flows are now officially stable and bring a number of improvements',
      date: new Date('2024-07-22'),
      prio: 'urgent',
      done: false,
      status: 'todo',
    },
    {
      id: 2,
      title: 'Start with Django',
      subtitle: 'Install and prepare',
      content: 'Install REST framework, set up venv, check requirements',
      date: new Date('2024-08-06'),
      prio: 'medium',
      done: false,
      status: 'todo',
    },
    {
      id: 3,
      title: 'Testing theming',
      subtitle: 'Check all themes: light, dark and default',
      content: 'very fiddly thing to make work',
      date: new Date('2024-06-23'),
      prio: 'low',
      done: false,
      status: 'todo',
    },
  ];

  inProgress: Task[] = [
    {
      id: 4,
      title: 'Make Drag and Drop work',
      subtitle: 'Check docs',
      content: 'N/A',
      date: new Date('2024-05-15'),
      prio: '',
      done: false,
      status: 'inProgress',
    },
    {
      id: 5,
      title: 'Check classes on dragging',
      subtitle: 'Classes are wrong by drag n drop',
      content: 'Check functions and classes',
      date: new Date('2024-06-01'),
      prio: 'low',
      done: false,
      status: 'inProgress',
    },
  ];

  done: Task[] = [
    {
      id: 6,
      title: 'Design Board',
      subtitle: 'Make the Layout and css classes',
      content: 'Pay attention to class naming',
      date: new Date('2024-07-19'),
      prio: 'medium',
      done: false,
      status: 'done',
    },
  ];

  // BehaviorSubjects for tracking task counts
  doneCount$ = new BehaviorSubject<number>(this.done.length);
  urgentCount$ = new BehaviorSubject<number>(this.urgent.length);
  inProgressCount$ = new BehaviorSubject<number>(this.inProgress.length);
  todoCount$ = new BehaviorSubject<number>(this.todo.length);
  overdueCount$ = new BehaviorSubject<number>(this.getOverdueCount());

  constructor() {}

  isDatePast(date: Date): boolean {
    const today = new Date();
    return date < today;
  }

  isDateOverdue(date: Date): boolean {
    return this.isDatePast(date);
  }

  getFormattedDate(date: Date): string {
    return (
      date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
    );
  }

  getOverdueCount(): number {
    return (
      this.urgent.filter((task) => this.isDateOverdue(task.date)).length +
      this.todo.filter((task) => this.isDateOverdue(task.date)).length +
      this.inProgress.filter((task) => this.isDateOverdue(task.date)).length +
      this.done.filter((task) => this.isDateOverdue(task.date)).length
    );
  }

  getPriorityClass(prio: string): string {
    switch (prio) {
      case 'urgent':
        return 'urgent';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return '';
    }
  }

  updateCounts() {
    this.doneCount$.next(this.done.length);
    this.urgentCount$.next(this.urgent.length);
    this.todoCount$.next(this.todo.length);
    this.inProgressCount$.next(this.inProgress.length);
    this.overdueCount$.next(this.getOverdueCount());
  }
}