import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilderFacade } from '@uqt/data-access/form-builder';
import {
  TFormGroups,
  FormGroupTypes,
  FormFieldTypes,
  DynamicFormFacade,
  IDynamicFormConfig
} from '@uqt/data-access/dynamic-form';
import { Validators } from '@angular/forms';

const STRUCTURE: TFormGroups = [
  {
    groupName: 'config',
    groupType: FormGroupTypes.Group,
    cssClasses: ['form-builder-create'],
    fields: [
      {
        type: FormFieldTypes.Input,
        inputType: 'text',
        name: 'formName',
        label: 'Form Name',
        validators: [Validators.required]
      },
      {
        type: FormFieldTypes.CheckBox,
        name: 'animations',
        label: 'Animations'
      },
      {
        type: FormFieldTypes.CheckBox,
        name: 'paginateSections',
        label: 'Section Pagination'
      }
    ]
  }
];

@Component({
  selector: 'uqt-example-form-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleCreateFormComponent implements OnInit, OnDestroy {
  readonly formName = 'form-builder-create';
  form$: Observable<IDynamicFormConfig[]>;
  sub: Subscription;

  constructor(
    private dynamicFormFacade: DynamicFormFacade,
    private formsFacade: FormBuilderFacade
  ) {
    this.form$ = this.formsFacade.form$;

    this.dynamicFormFacade.createFormIfNotExist(this.formName);

    this.sub = this.dynamicFormFacade
      .formSubmits$(this.formName)
      .subscribe((form: { config: Partial<IDynamicFormConfig> }) => {
        this.formsFacade.createForm(form.config);
      });
  }

  ngOnInit() {
    this.dynamicFormFacade.setFormConfig(this.formName, {
      structure: STRUCTURE
    });
    this.dynamicFormFacade.setData(this.formName, {
      config: {
        animations: false,
        paginateSections: false
      }
    });
    this.formsFacade.loadForms();
  }

  edit(form: IDynamicFormConfig) {
    this.formsFacade.selectForm(form.formName);
  }

  delete(form: IDynamicFormConfig) {
    this.formsFacade.deleteForm(form);
  }

  trackForms(i: number, f: IDynamicFormConfig) {
    return f.formName;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
