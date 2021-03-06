import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IUser } from '@ngw/types';

@Component({
  selector: 'ngw-ui-user-profile',
  templateUrl: './ui-user-profile.component.html',
  styleUrls: ['./ui-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiUserProfileComponent {
  @Input() user: IUser | undefined;
  @Input() profileForm: FormGroup | undefined;
  @Output() formSubmit = new EventEmitter<FormGroup>();
}
