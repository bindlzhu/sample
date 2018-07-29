import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';

import { SharedModule } from '@app/shared';
import { TestStore } from '@testing/utils';

import { NavigatorComponent } from './navigator.component';
import {
  ActionNavigatorAdd,
  ActionNavigatorFilter,
  ActionNavigatorToggle,
  ActionNavigatorRemoveDone,
  NavigatorState
} from './navigator.reducer';

describe('NavigatorComponent', () => {
  let component: NavigatorComponent;
  let fixture: ComponentFixture<NavigatorComponent>;
  let store: TestStore<NavigatorState>;
  let dispatchSpy;

  const getNavigator = () => fixture.debugElement.queryAll(By.css('.todo'));

  const getBigInput = () =>
    fixture.debugElement.query(By.css('anms-big-input'));

  const getBigInputValue = () =>
    getBigInput().query(By.css('input')).nativeElement.value;

  const getNavigatorFilter = () =>
    fixture.debugElement.query(By.css('.navigator-filter'));
  const getNavigatorFilterOptions = () =>
    fixture.debugElement.queryAll(
      By.css('.navigator-filter-menu-overlay .mat-menu-item')
    );

  const deleteDoneNavigatorBtn = () =>
    fixture.debugElement.query(
      By.css('anms-big-input-action[fontIcon="fa-trash"] > button')
    );
  const addTodoBtn = () =>
    fixture.debugElement.query(
      By.css('anms-big-input-action[fontIcon="fa-plus"] > button')
    );

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [NavigatorComponent],
        imports: [NoopAnimationsModule, SharedModule],
        providers: [{ provide: Store, useClass: TestStore }]
      }).compileComponents();
    })
  );

  beforeEach(
    inject([Store], (testStore: TestStore<NavigatorState>) => {
      store = testStore;
      store.setState({ items: [], filter: 'ALL' });
      fixture = TestBed.createComponent(NavigatorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should be created with 0 navigator', () => {
    expect(component).toBeTruthy();
    expect(component.navigator.items.length).toBe(0);
    expect(getNavigator().length).toBe(0);
  });

  it('should display navigator', () => {
    store.setState({
      items: [{ id: '1', name: 'test', done: false }],
      filter: 'ALL'
    });

    fixture.detectChanges();
    expect(getNavigator().length).toBe(1);
    expect(getNavigator()[0].nativeElement.textContent.trim()).toBe('test');
  });

  it('should filter and show "DONE" navigator', () => {
    store.setState({
      items: [
        { id: '1', name: 'test 1', done: true },
        { id: '2', name: 'test 2', done: false }
      ],
      filter: 'DONE'
    });

    fixture.detectChanges();
    expect(getNavigator().length).toBe(1);
    expect(getNavigator()[0].nativeElement.textContent.trim()).toBe('test 1');
  });

  it('should dispatch remove "DONE" navigator action', () => {
    store.setState({
      items: [
        { id: '1', name: 'test 1', done: true },
        { id: '2', name: 'test 2', done: false }
      ],
      filter: 'DONE'
    });

    fixture.detectChanges();
    dispatchSpy = spyOn(store, 'dispatch');
    deleteDoneNavigatorBtn().triggerEventHandler('click', {});

    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(new ActionNavigatorRemoveDone());
  });

  it('should dispatch add todo action', () => {
    dispatchSpy = spyOn(store, 'dispatch');
    component.newTodo = 'test';
    addTodoBtn().triggerEventHandler('click', {});

    fixture.detectChanges();
    expect(component.newTodo).toBe('');
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ActionNavigatorAdd({ name: 'test' })
    );
  });

  it('should dispatch filter todo action', () => {
    dispatchSpy = spyOn(store, 'dispatch');
    getNavigatorFilter().triggerEventHandler('click', {});
    getNavigatorFilterOptions()[2].triggerEventHandler('click', {});

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ActionNavigatorFilter({ filter: 'ACTIVE' })
    );
  });

  it('should dispatch toggle todo action', () => {
    store.setState({
      items: [{ id: '1', name: 'test 1', done: true }],
      filter: 'ALL'
    });

    fixture.detectChanges();
    dispatchSpy = spyOn(store, 'dispatch');
    getNavigator()[0]
      .query(By.css('.todo-label'))
      .triggerEventHandler('click', {});

    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new ActionNavigatorToggle({ id: '1' })
    );
  });

  it('should disable remove done navigator button if no todo is done', () => {
    store.setState({
      items: [{ id: '1', name: 'test 1', done: true }],
      filter: 'ALL'
    });

    fixture.detectChanges();
    expect(deleteDoneNavigatorBtn().nativeElement.disabled).toBeFalsy();

    component.navigator.items[0].done = false;

    fixture.detectChanges();
    expect(deleteDoneNavigatorBtn().nativeElement.disabled).toBeTruthy();
  });

  it('should disable add new todo button if input length is less than 4', () => {
    component.newTodo = 'test';

    fixture.detectChanges();
    expect(addTodoBtn().nativeElement.disabled).toBeFalsy();

    component.newTodo = 'tes';

    fixture.detectChanges();
    expect(addTodoBtn().nativeElement.disabled).toBeTruthy();
  });

  it('should clear new todo input value on ESC key press', () => {
    component.newTodo = 'tes';
    getBigInput().triggerEventHandler('keyup.escape', {});

    fixture.detectChanges();
    expect(getBigInputValue()).toBe('');
  });
});
