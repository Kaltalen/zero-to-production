import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGroupTypes, IToggleField } from '@uqt/data-access/dynamic-form';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormToggleComponent {
  @Input() idx: number; // Only accessed if it is a FormArrayGroup
  @Input() type: FormGroupTypes;
  @Input() field: IToggleField;
  @Input() group: FormGroup;
}
