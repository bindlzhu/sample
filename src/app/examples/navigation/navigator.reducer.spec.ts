import {
  ActionNavigatorFilter,
  ActionNavigatorRemoveDone,
  ActionNavigatorAdd,
  ActionNavigatorToggle,
  NavigatorState,
  navigatorReducer,
  initialState
} from './navigator.reducer';

describe('TodoReducer', () => {
  it('should return the default state', () => {
    const action = {} as any;
    const state = navigatorReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('should add a todo', () => {
    const TEST_INITIAL_STATE: NavigatorState = {
      items: [],
      filter: 'ALL'
    };
    const action = new ActionNavigatorAdd({ name: 'Mercuccio' });
    const state = navigatorReducer(TEST_INITIAL_STATE, action);

    expect(state.items.length).toEqual(1);
    expect(state.items[0].name).toEqual('Mercuccio');
  });

  it('should toggle selected todo', () => {
    const TEST_INITIAL_STATE: NavigatorState = {
      items: [{ id: '1', name: 'Tibald', done: false }],
      filter: 'ALL'
    };
    const action = new ActionNavigatorToggle({
      id: TEST_INITIAL_STATE.items[0].id
    });
    const state = navigatorReducer(TEST_INITIAL_STATE, action);
    expect(state.items[0].done).toEqual(true);
  });

  it('should remove done navigator', () => {
    const TEST_INITIAL_STATE: NavigatorState = {
      items: [
        { id: '1', name: 'Romeo', done: false },
        { id: '2', name: 'Juliet', done: true }
      ],
      filter: 'ALL'
    };
    const action = new ActionNavigatorRemoveDone();
    const state = navigatorReducer(TEST_INITIAL_STATE, action);
    expect(state.items.length).toBe(1);
    expect(state.items[0].name).toBe('Romeo');
    expect(state.items[0].done).toBeFalsy();
  });

  it('should return filtered navigator', () => {
    const TEST_INITIAL_STATE: NavigatorState = {
      items: [
        { id: '1', name: 'Friar Laurence', done: false },
        { id: '2', name: 'Friar John', done: false },
        { id: '3', name: 'Baltasar', done: true }
      ],
      filter: 'ALL'
    };
    const action = new ActionNavigatorFilter({ filter: 'DONE' });
    const state = navigatorReducer(TEST_INITIAL_STATE, action);

    expect(state.items.length).toEqual(3); // must not change items collection
    expect(state.filter).toEqual('DONE');
  });
});
