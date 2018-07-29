import * as fromNavigator from './navigator.reducer';

describe('Navigator Actions', () => {
  describe('NavigatorAdd', () => {
    it('should create an action', () => {
      const action = new fromNavigator.ActionNavigatorAdd({ name: 'test' });

      expect({ ...action }).toEqual({
        type: fromNavigator.NavigatorActionTypes.ADD,
        payload: { name: 'test' }
      });
    });
  });

  describe('ActionNavigatorToggle', () => {
    it('should create an action', () => {
      const action = new fromNavigator.ActionNavigatorToggle({ id: '1' });

      expect({ ...action }).toEqual({
        type: fromNavigator.NavigatorActionTypes.TOGGLE,
        payload: { id: '1' }
      });
    });
  });

  describe('ActionNavigatorRemoveDone', () => {
    it('should create an action', () => {
      const action = new fromNavigator.ActionNavigatorRemoveDone();

      expect({ ...action }).toEqual({
        type: fromNavigator.NavigatorActionTypes.REMOVE_DONE
      });
    });
  });

  describe('ActionNavigatorFilter', () => {
    it('should create an action', () => {
      const action = new fromNavigator.ActionNavigatorFilter({ filter: 'DONE' });

      expect({ ...action }).toEqual({
        type: fromNavigator.NavigatorActionTypes.FILTER,
        payload: { filter: 'DONE' }
      });
    });
  });

  describe('ActionNavigatorPersist', () => {
    it('should create an action', () => {
      const action = new fromNavigator.ActionNavigatorPersist({ navigator: [] });

      expect({ ...action }).toEqual({
        type: fromNavigator.NavigatorActionTypes.PERSIST,
        payload: { navigator: [] }
      });
    });
  });
});
