import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelationsPageRoutingModule } from './relations-routing.module';

import { RelationsPage } from './relations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelationsPageRoutingModule
  ],
  declarations: [RelationsPage]
})
export class RelationsPageModule {}
