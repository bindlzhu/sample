import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LocalStorageService } from '@app/core';

import {
  ActionNavigatorPersist,
  TODOS_KEY,
  NavigatorActionTypes
} from './navigator.reducer';

@Injectable()
export class NavigatorEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService
  ) {}

  @Effect({ dispatch: false })
  persistNavigator(): Observable<Action> {
    return this.actions$
      .ofType(NavigatorActionTypes.PERSIST)
      .pipe(
        tap((action: ActionNavigatorPersist) =>
          this.localStorageService.setItem(TODOS_KEY, action.payload.navigator)
        )
      );
  }
}
