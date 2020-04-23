import { Component, OnInit } from '@angular/core';
import { ControllerPage } from '../controller/controller.page';
import { DataPage } from '../data/data.page';
import { GraphsPage } from '../graphs/graphs.page';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  controller=ControllerPage;
  data=DataPage;
  graphs=GraphsPage;

  constructor() { }

  ngOnInit() {
  }

}
