import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import {
  ILoginCredentials,
  IRegistrationDetails
} from '@ngw/shared/interfaces';
import { Observable } from 'rxjs';
import { AvailableStatus } from './auth.reducer';
import { selectLoggedInStatus, selectAvailability } from './auth.selectors';

@Injectable()
export class AuthFacade {
  loggedInStatus$: Observable<boolean>;
  usernameAvailability$: Observable<AvailableStatus | null>;

  constructor(private store: Store<any>) {
    this.loggedInStatus$ = this.store.pipe(select(selectLoggedInStatus));
    this.usernameAvailability$ = this.store.pipe(select(selectAvailability));
  }

  login(credentials: ILoginCredentials): void {
    this.store.dispatch(AuthActions.login(credentials));
  }

  register(userDetails: IRegistrationDetails) {
    this.store.dispatch(AuthActions.register({ details: userDetails }));
  }

  loginRedirect(): void {
    this.store.dispatch(AuthActions.loginRedirect());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  usernamePending() {
    this.store.dispatch(AuthActions.usernamePending());
  }

  usernameAvailable() {
    this.store.dispatch(AuthActions.usernameAvailable());
  }

  usernameUnAvailable() {
    this.store.dispatch(AuthActions.usernameUnAvailable());
  }

  clearAvailable() {
    this.store.dispatch(AuthActions.clearAvailability());
  }
}
