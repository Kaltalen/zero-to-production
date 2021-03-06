import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { tap, map, withLatestFrom } from 'rxjs/operators';
import { Effect, ofType, Actions } from '@ngrx/effects';
import * as RouterActions from './router.actions';
import { RouterFacade } from './router.facade';

@Injectable()
export class RouterEffects {
  @Effect()
  navigate$ = this.action$.pipe(
    ofType(RouterActions.navigate),
    map(({ nav }) => {
      if (nav.relative) {
        return RouterActions.relativeNavigate({ nav });
      } else {
        return RouterActions.absoluteNavigate({ nav });
      }
    })
  );

  @Effect({ dispatch: false })
  relativeNavigate$ = this.action$.pipe(
    ofType(RouterActions.relativeNavigate),
    withLatestFrom(this.facade.url$),
    tap(([{ nav: { path, query: queryParams } }, url]) => {
      // add the current route to the front the supplied path
      const newPath = path.slice();
      newPath.unshift(url);
      this.router.navigate(newPath, { queryParams });
    })
  );

  @Effect({ dispatch: false })
  absoluteNavigate$ = this.action$.pipe(
    ofType(RouterActions.absoluteNavigate),
    tap(({ nav: { path, query: queryParams } }) =>
      this.router.navigate(path, { queryParams })
    )
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.action$.pipe(
    ofType(RouterActions.navigateBack),
    tap(() => this.location.back())
  );

  @Effect({ dispatch: false })
  navigateForward$ = this.action$.pipe(
    ofType(RouterActions.navigateForward),
    tap(() => this.location.forward())
  );

  @Effect({ dispatch: false })
  updateUrl$ = this.action$.pipe(
    ofType(RouterActions.updateUrl),
    tap(({ url }) => this.location.go(url))
  );

  constructor(
    private action$: Actions,
    private router: Router,
    private location: Location,
    private facade: RouterFacade
  ) {}
}
