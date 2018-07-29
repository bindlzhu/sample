import { v4 as uuid } from 'uuid';
import { Action } from '@ngrx/store';

export const TODOS_KEY = 'EXAMPLES.TODOS';

export enum NavigatorActionTypes {
  ADD = '[Navigator] Add',
  TOGGLE = '[Navigator] Toggle',
  REMOVE_DONE = '[Navigator] Remove Done',
  FILTER = '[Navigator] Filter',
  PERSIST = '[Navigator] Persist'
}

export class ActionNavigatorAdd implements Action {
  readonly type = NavigatorActionTypes.ADD;
  constructor(public payload: { name: string }) {}
}

export class ActionNavigatorToggle implements Action {
  readonly type = NavigatorActionTypes.TOGGLE;
  constructor(public payload: { id: string }) {}
}

export class ActionNavigatorRemoveDone implements Action {
  readonly type = NavigatorActionTypes.REMOVE_DONE;
}

export class ActionNavigatorFilter implements Action {
  readonly type = NavigatorActionTypes.FILTER;
  constructor(public payload: { filter: NavigatorFilter }) {}
}

export class ActionNavigatorPersist implements Action {
  readonly type = NavigatorActionTypes.PERSIST;
  constructor(public payload: { navigator: Todo[] }) {}
}

export type NavigatorActions =
  | ActionNavigatorAdd
  | ActionNavigatorToggle
  | ActionNavigatorRemoveDone
  | ActionNavigatorFilter
  | ActionNavigatorPersist;

export const initialState: NavigatorState = {
  items: [
    { id: uuid(), name: 'Open Todo list example', done: true },
    { id: uuid(), name: 'Check the other examples', done: false },
    {
      id: uuid(),
      name: 'Use Marc Navigation in your project',
      done: false
    }
  ],
  filter: 'ALL'
};

export const selectorNavigator = state => state.examples.navigator;

export function navigatorReducer(
  state: NavigatorState = initialState,
  action: NavigatorActions
): NavigatorState {
  switch (action.type) {
    case NavigatorActionTypes.ADD:
      return {
        ...state,
        items: [
          {
            id: uuid(),
            name: action.payload.name,
            done: false
          }
        ].concat(state.items)
      };

    case NavigatorActionTypes.TOGGLE:
      return {
        ...state,
        items: state.items.map(
          (item: Todo) =>
            item.id === action.payload.id ? { ...item, done: !item.done } : item
        )
      };

    case NavigatorActionTypes.REMOVE_DONE:
      return {
        ...state,
        items: state.items.filter((item: Todo) => !item.done)
      };

    case NavigatorActionTypes.FILTER:
      return { ...state, filter: action.payload.filter };

    default:
      return state;
  }
}

export interface Todo {
  id: string;
  name: string;
  done: boolean;
}

export type NavigatorFilter = 'ALL' | 'DONE' | 'ACTIVE';

export interface NavigatorState {
  items: Todo[];
  filter: NavigatorFilter;
}
