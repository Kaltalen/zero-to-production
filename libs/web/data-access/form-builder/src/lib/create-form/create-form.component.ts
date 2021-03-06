import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicFormFacade } from '@ngw/data-access/dynamic-form';
import { FormsFacade } from '../+state/form-builder.facade';
import { TFormGroups, IFormBuilderStructure } from '@ngw/types';
import { FormGroupTypes, FormFieldTypes } from '@ngw/enums';
import { Subscription } from 'rxjs';

const STRUCTURE: TFormGroups = [
  {
    formGroup: 'config',
    groupType: FormGroupTypes.Group,
    fields: [
      {
        componentType: FormFieldTypes.Input,
        type: 'text',
        name: 'formName',
        label: 'FormName',
        validators: [Validators.required]
      }
    ]
  }
];

@Component({
  selector: 'ngw-form-builder-create',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateFormComponent implements OnInit {
  sub: Subscription;

  constructor(
    private facade: FormsFacade,
    private dynamicFormFacade: DynamicFormFacade
  ) {
    this.sub = this.dynamicFormFacade.submit$.subscribe(
      (form: IFormBuilderStructure) => {
        this.facade.createForm({ ...form, formGroups: [] });
      }
    );
  }

  ngOnInit() {
    this.dynamicFormFacade.setStructure({ structure: STRUCTURE });
    this.facade.clearSelected();
    this.facade.loadForms();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
