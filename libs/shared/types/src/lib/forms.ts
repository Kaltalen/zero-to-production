import { ValidatorFn, AsyncValidator } from '@angular/forms';
import { Type } from '@angular/core';
import { FormGroupTypes, FormArrayTypes, FormFieldTypes } from '@ngw/enums';

export type TField =
  | IInputField
  | ISelectField
  | IToggleField
  | IDatePickerField
  | ITextArea;

export type TFormGroups = (IFormGroup | TFormArray)[];

export interface IFormGroup {
  formGroup: string;
  groupType: FormGroupTypes.Group;
  fields: TField[];
}

export type TFormArray = IFormGroupArray | IFormFieldArray;

export interface IBaseFormArray {
  formGroup: string;
  groupType: FormGroupTypes.Array;
  initialNumber?: number;
}

export interface IFormGroupArray extends IBaseFormArray {
  arrayType: FormArrayTypes.Group;
  fields: TField[];
}

export interface IFormFieldArray extends IBaseFormArray {
  arrayType: FormArrayTypes.Field;
  field: TField;
}

export interface IBaseField {
  name: string;
  label: string;
  initialValue?: any;
  validators?: ValidatorFn[];
  asyncValidators?: Type<AsyncValidator>[];
  autocomplete?: TAutoComplete;
  appearance?: TFormFieldAppearance;
  color?: string;
  attrs?: any;
  customComponent?: Type<any>;
}

export interface IInputField extends IBaseField {
  componentType: FormFieldTypes.Input;
  type: TInputType;
}

export interface ITextArea extends IBaseField {
  componentType: FormFieldTypes.TextArea;
}

export interface ISelectField extends IBaseField {
  componentType: FormFieldTypes.Select;
  selectOptions: ISelectOption[];
}

export interface IToggleField extends IBaseField {
  componentType: FormFieldTypes.Toggle;
}

export interface IDatePickerField extends IBaseField {
  componentType: FormFieldTypes.DatePicker;
}

export interface ISelectOption {
  display: string;
  value: any;
}

// There are more to complete here
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
export type TAutoComplete =
  | 'off'
  | 'on'
  | 'name'
  | 'given-name'
  | 'family-name'
  | 'email'
  | 'username'
  | 'bday'
  | 'tel'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  | 'organization-title'
  | 'organization'
  | 'street-address';

export type TInputType =
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export type TFormFieldAppearance = 'standard' | 'fill' | 'outline';

/**
 * The below is for the form builder
 */
export interface IFormBuilderStructure {
  id: string;
  config: {
    formName: string;
    animations?: boolean;
  };
  formGroups: IFormBuilderGroup[];
}

export interface IFormBuilderGroup {
  groupName: string;
  fields: IFormBuilderField[];
}

export interface IFormBuilderField {
  fieldName: string;
  fieldLabel: string;
  fieldType: FormFieldTypes;
}
