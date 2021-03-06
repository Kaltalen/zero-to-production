import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceWorkerService } from './service-worker.service';

@NgModule({
  imports: [CommonModule],
  providers: [ServiceWorkerService]
})
export class FrontendDataAccessServiceWorkerModule {}
