import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './form/form.component';
import { InputComponent } from './fields/input/input.component';
import { SelectComponent } from './fields/select/select.component';
import { DynamicFieldDirective } from './fields/dynamic-field.directive';
import { DynamicFormFacade } from './+state/dynamic-form.facade';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DynamicFormsEffects } from './+state/dynamic-form.effects';
import { reducer, initialFormState } from './+state/dynamic-form.reducer';
import { CustomMaterialModule } from '@workspace/common/ui/custom-material';
import { FormErrorsComponent } from './form-errors/form-errors.component';
import { FormErrorPipe } from './form-errors/form-error.pipe';
import { ToggleComponent } from './fields/toggle/toggle.components';
import { DynamicFormService } from './form.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    StoreModule.forFeature('dynoForm', reducer, {
      initialState: initialFormState
    }),
    EffectsModule.forFeature([DynamicFormsEffects])
  ],
  providers: [DynamicFormService, DynamicFormFacade],
  declarations: [
    DynamicFieldDirective,
    InputComponent,
    SelectComponent,
    ToggleComponent,
    DynamicFormComponent,
    FormErrorsComponent,
    FormErrorsComponent,
    FormErrorPipe
  ],
  entryComponents: [InputComponent, SelectComponent, ToggleComponent],
  exports: [DynamicFormComponent, FormErrorsComponent]
})
export class DataAccessDynamicFormModule {}
