import { Injectable, Injector } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  FormControl,
  AsyncValidatorFn,
  AsyncValidator,
  Validators,
  FormBuilder
} from '@angular/forms';
import { IFormErrors, TField, TFormGroups } from './form.models';

@Injectable({ providedIn: 'root' })
export class DynamicFormService {
  //
  constructor(private injector: Injector, private fb: FormBuilder) {}

  formBuilder(structure: TFormGroups): FormGroup {
    // Top level group
    const form = this.fb.group({});

    // For each top level group
    structure.forEach(group => {
      // Create a form group,
      const fg = this.fb.group({});
      // and add all nested groups to the form
      group.fields.forEach(field => {
        fg.addControl(field.name, this.createControl(field));
      });
      // then add the nested form group to the top level group
      form.addControl(group.name, fg);
    });
    return form;
  }

  createControl(field: TField): FormControl {
    const asyncValidators: AsyncValidatorFn[] = [];
    if (field.asyncValidators) {
      field.asyncValidators.forEach(di => {
        const validator = this.injector.get<AsyncValidator>(di);
        asyncValidators.push(validator.validate.bind(validator));
      });
    }

    const validators = Validators.compose(
      field.validators ? field.validators : []
    );

    return this.fb.control(field.initialValue, validators, asyncValidators);
  }

  getAllFormErrors(form: FormGroup) {
    const errors: IFormErrors = {};
    if (form.errors) {
      errors['form'] = form.errors;
    }
    return { ...errors, ...this.getControlErrors(form) };
  }

  getControlErrors(form: FormGroup): IFormErrors {
    // Get a list of all the control names
    const formControls = Object.keys(form.controls);
    /*
     * Iterate over them, each time checking if it is a form control or group
     * if it is a group, then recursively collect the errors
     */
    return formControls.reduce(
      (errors, controlName) => {
        const control = form.controls[controlName];

        if (this.isControlAFormGroup(control)) {
          // A form group may have a top level for error
          if (this.controlHasErrors(control)) {
            errors[controlName] = control.errors as ValidationErrors;
          }

          return {
            ...errors,
            ...this.getControlErrors(control as FormGroup)
          };
        } else {
          // it is a control
          if (this.controlHasErrors(control)) {
            errors[controlName] = control.errors as ValidationErrors;
          }
          return errors;
        }
      },
      {} as IFormErrors
    );
  }

  isControlAFormGroup(control: AbstractControl | FormGroup): boolean {
    return (control as FormGroup).controls !== undefined;
  }

  controlHasErrors(control: AbstractControl | FormGroup): boolean {
    return control.errors !== null;
  }
}
