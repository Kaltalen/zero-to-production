import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { hot, Scheduler } from 'jest-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { createSpyObj } from '@uqt/tests/client';
import { AppEffects } from './app.effects';
import { NotificationService } from '@uqt/utils/notifications';
import { Router } from '@angular/router';
import { AuthActions } from '@uqt/shared/data-access/auth';
import { GraphQLService } from '@uqt/shared/data-access/api';

describe('AppEffects', () => {
  let effects: AppEffects;
  let actions$: Observable<any>;
  let router: Router;
  let ns: NotificationService;
  let graphql: GraphQLService;
  const nsSpy = createSpyObj('NotificationService', ['emit']);
  const graphQlSpy = createSpyObj('GraphQLService', ['clearCache']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppEffects,
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: NotificationService, useValue: nsSpy },
        { provide: GraphQLService, useValue: graphQlSpy },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject<AppEffects>(AppEffects);
    actions$ = TestBed.inject<Actions>(Actions);
    router = TestBed.inject<Router>(Router);
    ns = TestBed.inject<NotificationService>(NotificationService);
    graphql = TestBed.inject<GraphQLService>(GraphQLService);
  });

  describe('loginRedirect$', () => {
    it('should navigate to "/home"', () => {
      const spy = jest.spyOn(router, 'navigate');
      spy.mockReset();
      const action = AuthActions.loginRedirect();

      actions$ = hot('-a---', { a: action });

      effects.loginRedirects$.subscribe();

      Scheduler.get().flush();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(['home']);
    });
  });

  describe('registerRedirect$', () => {
    it('should navigate to "/register"', () => {
      const spy = jest.spyOn(router, 'navigate');
      spy.mockReset();

      const action = AuthActions.registerRedirect();

      actions$ = hot('-a---', { a: action });

      effects.registerRedirect$.subscribe();

      Scheduler.get().flush();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(['register']);
    });
  });

  describe('logoutRedirect$', () => {
    it('should clear the GraphQL cache', () => {
      const spy = jest.spyOn(graphql, 'clearCache');
      spy.mockReset();
      const action = AuthActions.logoutRedirect();

      actions$ = hot('-a---', { a: action });

      effects.logoutRedirect$.subscribe();

      Scheduler.get().flush();

      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to "/login"', () => {
      const spy = jest.spyOn(router, 'navigate');
      spy.mockReset();
      const action = AuthActions.logoutRedirect();

      actions$ = hot('-a---', { a: action });

      effects.logoutRedirect$.subscribe();

      Scheduler.get().flush();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(['login']);
    });
  });

  describe('loginFailure$', () => {
    it('should notify the user of login failure', () => {
      const routerSpy = jest.spyOn(router, 'navigate');
      const spy = jest.spyOn(ns, 'emit');
      jest.resetAllMocks();

      const action = AuthActions.loginFailure({ error: 'Nope!!' });

      actions$ = hot('-a---', { a: action });

      effects.loginFailure$.subscribe();

      Scheduler.get().flush();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('registerSuccess$', () => {
    it('should notify the user of successful registration', () => {
      const routerSpy = jest.spyOn(router, 'navigate');
      const spy = jest.spyOn(ns, 'emit');
      jest.resetAllMocks();
      const action = AuthActions.registerSuccess({ user: {} as any });

      actions$ = hot('-a---', { a: action });

      effects.registerSuccess$.subscribe();

      Scheduler.get().flush();

      expect(spy).toHaveBeenCalled();
    });
  });
});