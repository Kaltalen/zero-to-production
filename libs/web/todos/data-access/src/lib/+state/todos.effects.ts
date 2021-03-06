import { Injectable } from '@angular/core';
import { catchError, map, exhaustMap, mergeMap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as TodoActions from './todos.actions';
import { TodosService } from '../todos.service';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// Note: when merging observable from multiple sources there are 4x operators tha can be uses
// exhaustMap, mergeMap, switchMap and concatMap

// exhaustMap -> ignores subsequent request until the current one has completed
// use when you want the current one to complete. e.g. login or loading initial resources. Ignore everything else until it completes.

// mergeMap -> all effects happen concurrently. Nothing is aborted and all observables complete (or error)
// This is good for action where the order of completion does not matter as they may complete out of time.. i.e. deleting or adding an item.

// switchMap -> switches to the current observable as it. Note that it sends the unsubscribe (and subsequent cancel) to the current observable.
// This is generally not desired for API calls as the current request will be cancelled. i.e. if you spam the delete button the next click will
// cancel the current delete API call. This is undesired.

// concatMap -> merges the observable in the correct order. No observable is ignored and everything runs sequentially. Use this when order matters.

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions, private todoService: TodosService) {}

  @Effect()
  loadTodos$ = this.actions$.pipe(
    ofType(TodoActions.loadTodos),
    exhaustMap(action =>
      this.todoService.getAllTodos().pipe(
        map(result => {
          if (result.errors) {
            return TodoActions.loadTodosFail({
              error: result.errors[0].message
            });
          } else if (result.data) {
            return TodoActions.loadTodosSuccess({
              todos: result.data.allTodos
            });
          }
        }),
        catchError((error: HttpErrorResponse) =>
          of(TodoActions.loadTodosFail({ error: error.message }))
        )
      )
    )
  );

  @Effect()
  createTodo$ = this.actions$.pipe(
    ofType(TodoActions.createTodo),
    mergeMap(({ todo }) =>
      this.todoService.createTodo(todo).pipe(
        map(result => {
          if (result.errors) {
            return TodoActions.createTodoFail({
              error: result.errors[0].message
            });
          } else if (result.data) {
            return TodoActions.createTodoSuccess({
              todo: result.data.newTodo
            });
          }
        }),
        catchError((error: HttpErrorResponse) =>
          of(TodoActions.createTodoFail({ error: error.message }))
        )
      )
    )
  );

  @Effect()
  updateTodo$ = this.actions$.pipe(
    ofType(TodoActions.updateTodo),
    mergeMap(({ todo }) =>
      this.todoService.updateTodo(todo).pipe(
        map(result => {
          if (result.errors) {
            return TodoActions.updateTodoFail({
              error: result.errors[0].message
            });
          } else if (result.data) {
            return TodoActions.updateTodoSuccess({
              todo: { id: todo.id, changes: result.data.updateTodo }
            });
          }
        }),

        catchError((error: HttpErrorResponse) =>
          of(TodoActions.updateTodoFail({ error: error.message }))
        )
      )
    )
  );

  @Effect()
  deleteTodo$ = this.actions$.pipe(
    ofType(TodoActions.deleteTodo),
    mergeMap(({ todo }) =>
      this.todoService.deleteTodo(todo.id).pipe(
        map(result => {
          if (result.errors) {
            return TodoActions.deleteTodoFail({
              error: result.errors[0].message
            });
          } else if (result.data) {
            return TodoActions.deleteTodoSuccess({ id: todo.id });
          }
        }),
        catchError((error: HttpErrorResponse) =>
          of(TodoActions.deleteTodoFail({ error: error.message }))
        )
      )
    )
  );
}
