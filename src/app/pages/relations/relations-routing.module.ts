import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelationsPage } from './relations.page';

const routes: Routes = [
  {
    path: '',
    component: RelationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelationsPageRoutingModule {}
