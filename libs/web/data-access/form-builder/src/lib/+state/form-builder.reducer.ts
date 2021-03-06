import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as FormActions from './form-builder.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { IFormBuilderStructure } from '@ngw/types';

export interface FormsEntityState extends EntityState<IFormBuilderStructure> {
  selectedFormId: string | null;
}

export const adapter: EntityAdapter<
  IFormBuilderStructure
> = createEntityAdapter<IFormBuilderStructure>();

// 3. Define the initial state
export const initialState: FormsEntityState = adapter.getInitialState({
  selectedFormId: null
});

export const formsReducer = createReducer(
  initialState,
  on(FormActions.selectForm, (state, { id }) => {
    return { ...state, selectedFormId: id };
  }),
  on(FormActions.clearSelected, state => {
    return { ...state, selectedFormId: null };
  }),
  on(FormActions.loadFormsSuccess, (state, { forms }) => {
    return adapter.addAll(forms, state);
  }),
  on(FormActions.createFormSuccess, (state, { form }) => {
    return adapter.addOne(form, state);
  }),
  on(FormActions.updateFormSuccess, (state, { form }) => {
    return adapter.updateOne(form, state);
  }),
  on(FormActions.deleteFormSuccess, (state, { id }) => {
    return adapter.removeOne(id, state);
  })
);

export function reducer(state: FormsEntityState | undefined, action: Action) {
  return formsReducer(state, action);
}
