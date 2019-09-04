import { createAction, props } from '@ngrx/store';
import { IExample } from '@ngw/shared/interfaces';

export const selectExample = createAction(
  '[Example/UI] Select',
  props<{ id: string }>()
);

export const clearSelected = createAction('[Example/UI] Clear');

export const searchFilter = createAction(
  '[Example/UI] Search Filter',
  props<{ search: string }>()
);

export const addExamples = createAction(
  '[Example] Add',
  props<{ examples: IExample[] }>()
);
