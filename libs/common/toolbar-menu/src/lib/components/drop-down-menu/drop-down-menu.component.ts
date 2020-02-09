import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { take, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IUser } from '@uqt/data';
import { UsersFacade } from '@uqt/shared/users/data-access';

@Component({
  selector: 'uqt-drop-down-menu',
  templateUrl: './drop-down-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropDownMenuComponent {
  public user$: Observable<IUser | undefined>;

  @Output() navigateToProfile = new EventEmitter();
  @Output() logout = new EventEmitter();

  constructor(private userFacade: UsersFacade) {
    this.user$ = this.userFacade.authUser$.pipe(
      filter(user => user !== undefined)
    );
  }

  toggleDarkMode(darkMode: boolean) {}
}