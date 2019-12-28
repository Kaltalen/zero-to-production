import { ValidatorFn, AsyncValidator } from '@angular/forms';
import { Type } from '@angular/core';
import { DynamicFormErrorsMap } from './form-errors/form-errors';

export type TField =
  | IInputField
  | ISelectField
  | IToggleField
  | IDatePickerField
  | ITextArea
  | ICustomInput;

export type TFormGroups = (IFormGroup | TFormArray)[];

export interface IFormGroup {
  formGroup: string;
  groupType: FormGroupTypes.Group;
  fields: TField[];
  cssClasses?: string[];
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
  validators?: ValidatorFn[];
  asyncValidators?: Type<AsyncValidator>[];
  autocomplete?: TAutoComplete;
  attrs?: any;
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

export interface ICustomInput extends IBaseField {
  componentType: string;
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

// Muse be strings
export enum FormGroupTypes {
  Group = 'GROUP',
  Array = 'ARRAY'
}

export enum FormArrayTypes {
  Group = 'GROUP',
  Field = 'FIELD'
}

export enum FormFieldTypes {
  Input = 'INPUT',
  TextArea = 'TEXT_AREA',
  Select = 'SELECT',
  Toggle = 'TOGGLE',
  DatePicker = 'DATE_PICKER'
}

export interface DynamicFormConfig {
  components: BaseComponentMap;
  errors?: DynamicFormErrorsMap;
}

export type BaseComponentMap = {
  [key in FormFieldTypes]: Type<any>;
};

export type CustomComponentMap = {
  [key: string]: Type<any>;
};

export interface DynamicFormComponentMap
  extends BaseComponentMap,
    CustomComponentMap {}
