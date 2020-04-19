import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { ControllerPageModule } from '../controller/controller.module';
import { DataPageModule } from '../data/data.module';
import { GraphsPageModule } from '../graphs/graphs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    SuperTabsModule,
    ControllerPageModule,
    DataPageModule,
    GraphsPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
