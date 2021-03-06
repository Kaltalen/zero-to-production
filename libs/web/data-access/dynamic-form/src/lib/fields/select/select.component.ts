import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGroupTypes } from '@ngw/enums';
import { TField } from '@ngw/types';

@Component({
  selector: 'app-form-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormSelectComponent {
  @Input() idx: number | undefined;
  @Input() type!: FormGroupTypes;
  @Input() field!: TField;
  @Input() group!: FormGroup;
}
