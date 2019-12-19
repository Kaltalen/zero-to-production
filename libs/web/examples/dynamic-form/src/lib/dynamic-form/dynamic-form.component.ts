import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  DynamicFormFacade,
  TFormGroups,
  FormGroupTypes,
  FormFieldTypes
} from '@uqt/data-access/dynamic-form';
import { CodeHighlightService } from '@uqt/web/examples/code-highlight';
import { IExample } from '@uqt/types';

const SIMPLE_FORM: TFormGroups = [
  {
    formGroup: 'contactDetails',
    groupType: FormGroupTypes.Group,
    fields: [
      {
        componentType: FormFieldTypes.Input,
        type: 'text',
        name: 'contactNumber',
        label: 'Contact Number',
        validators: [Validators.required]
      },
      {
        componentType: FormFieldTypes.Input,
        type: 'email',
        name: 'emailAddress',
        label: 'Email Address',
        validators: [Validators.required, Validators.email]
      }
    ]
  }
];

const COMPLEX_FORM: TFormGroups = [
  {
    formGroup: 'userDetails',
    groupType: FormGroupTypes.Group,
    fields: [
      {
        componentType: FormFieldTypes.Input,
        type: 'text',
        name: 'givenName',
        label: 'Given Name',
        autocomplete: 'given-name',
        validators: [Validators.required]
      },
      {
        componentType: FormFieldTypes.Input,
        type: 'text',
        name: 'surname',
        autocomplete: 'family-name',
        label: 'Email Address'
      }
    ]
  },
  {
    formGroup: 'additionalDetails',
    groupType: FormGroupTypes.Group,
    fields: [
      {
        componentType: FormFieldTypes.DatePicker,
        name: 'dateOfBirth',
        label: 'Date Of Birth',
        autocomplete: 'bday',
        validators: [Validators.required]
      }
    ]
  }
];

@Component({
  selector: 'example-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleDynamicFormComponent implements OnInit, AfterViewInit {
  example: IExample | undefined;
  simpleStructure = true;
  submit$: Observable<any>;

  component = `// example.component.ts
  const CONTACT_DETAILS: TFormGroups = [
    {
      formGroup: 'contactDetails',
      groupType: FormGroupTypes.Group,
      fields: [
        {
          componentType: FormFieldTypes.Input,
          type: 'text',
          name: 'contactNumber',
          label: 'Contact Number',
          validators: [Validators.required]
        },
        {
          componentType: FormFieldTypes.Input,
          type: 'email',
          name: 'emailAddress',
          label: 'Email Address',
          validators: [Validators.required, Validators.email]
        }
      ]
    }
  ];

  ...
  
  ngOnInit() {
    this.formFacade.setStructure({ structure: CONTACT_DETAILS });
  }`;

  markup = `<!-- example.component.html -->
  <app-dynamic-form>
    <button type="submit">Submit</button>
  </app-dynamic-form>`;

  submitSyntax = `// example.component.ts
  constructor(private formFacade: DynamicFormFacade) {
    this.formFacade.submit$.subscribe(formOutput => {
        // do something with the output
    });
  }`;

  constructor(
    private formFacade: DynamicFormFacade,
    private highlight: CodeHighlightService
  ) {
    this.submit$ = this.formFacade.submit$;
  }

  ngOnInit() {
    this.formFacade.setStructure({ structure: SIMPLE_FORM });
  }

  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

  setStructure(simpleForm: boolean) {
    if (simpleForm) {
      this.formFacade.resetIndex();
      this.formFacade.setStructure({ structure: SIMPLE_FORM });
    } else {
      this.formFacade.setStructure({ structure: COMPLEX_FORM });
    }
    this.simpleStructure = simpleForm;
  }

  toggleAnimations(change: MatSlideToggleChange) {
    this.formFacade.setFormConfig({ animations: change.checked });
  }

  togglePagination(change: MatSlideToggleChange) {
    this.formFacade.setFormConfig({ paginateSections: change.checked });
  }
}
