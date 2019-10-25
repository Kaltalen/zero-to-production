import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
  loginRedirect,
  logoutRedirect,
  registerRedirect
} from '@ngw/data-access/auth';
import { RouterFacade } from '@ngw/data-access/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppEffects {
  @Effect({ dispatch: false })
  loginRedirects$ = this.action$.pipe(
    ofType(loginRedirect),
    tap(action =>
      this.routerFacade.go({
        path: ['secure', 'home']
      })
    )
  );

  @Effect({ dispatch: false })
  registerRedirect$ = this.action$.pipe(
    ofType(registerRedirect),
    tap(action =>
      this.routerFacade.go({
        path: ['secure', 'register']
      })
    )
  );

  @Effect({ dispatch: false })
  logoutRedirect$ = this.action$.pipe(
    ofType(logoutRedirect),
    tap(action =>
      this.routerFacade.go({
        path: ['secure', 'login']
      })
    )
  );
  constructor(private action$: Actions, private routerFacade: RouterFacade) {}
}
