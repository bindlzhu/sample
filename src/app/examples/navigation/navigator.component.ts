import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';

import {
  ActionNavigatorAdd,
  ActionNavigatorPersist,
  ActionNavigatorFilter,
  ActionNavigatorRemoveDone,
  ActionNavigatorToggle,
  selectorNavigator,
  Todo,
  NavigatorFilter,
  NavigatorState
} from './navigator.reducer';

@Component({
  selector: 'anms-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  navigator: NavigatorState;
  newTodo = '';

  constructor(public store: Store<any>, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.store
      .select(selectorNavigator)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(navigator => {
        this.navigator = navigator;
        this.store.dispatch(new ActionNavigatorPersist({ navigator }));
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get filteredNavigator() {
    const filter = this.navigator.filter;
    if (filter === 'ALL') {
      return this.navigator.items;
    } else {
      const predicate = filter === 'DONE' ? t => t.done : t => !t.done;
      return this.navigator.items.filter(predicate);
    }
  }

  get isAddTodoDisabled() {
    return this.newTodo.length < 4;
  }

  get isRemoveDoneNavigatorDisabled() {
    return this.navigator.items.filter(item => item.done).length === 0;
  }

  onNewTodoChange(newTodo: string) {
    this.newTodo = newTodo;
  }

  onNewTodoClear() {
    this.newTodo = '';
  }

  onAddTodo() {
    this.store.dispatch(new ActionNavigatorAdd({ name: this.newTodo }));
    this.showNotification(`"${this.newTodo}" added`);
    this.newTodo = '';
  }

  onToggleTodo(todo: Todo) {
    const newStatus = todo.done ? 'active' : 'done';
    this.store.dispatch(new ActionNavigatorToggle({ id: todo.id }));
    this.showNotification(`Toggled "${todo.name}" to ${newStatus}`, 'Undo')
      .onAction()
      .subscribe(() => this.onToggleTodo({ ...todo, done: !todo.done }));
  }

  onRemoveDoneNavigator() {
    this.store.dispatch(new ActionNavigatorRemoveDone());
    this.showNotification('Removed done navigator');
  }

  onFilterNavigator(filter: NavigatorFilter) {
    this.store.dispatch(new ActionNavigatorFilter({ filter }));
    this.showNotification(`Filtered to ${filter.toLowerCase()}`);
  }

  private showNotification(message: string, action?: string) {
    return this.snackBar.open(message, action, {
      duration: 2500,
      panelClass: 'navigator-notification-overlay'
    });
  }
}
