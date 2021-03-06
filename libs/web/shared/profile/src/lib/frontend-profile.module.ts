import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UiUserProfileComponent } from './ui-user-profile/ui-user-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '@ngw/common/ui/custom-material';
import { FrontendProfileRouterModule } from './frontend-profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FrontendProfileRouterModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ],
  declarations: [UserProfileComponent, UiUserProfileComponent]
})
export class FrontendProfileModule {}
