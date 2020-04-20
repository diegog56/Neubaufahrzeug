import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {

  //   Velocidad
  // b. Distancia recorrida
  // c. Tiempo total del viaje
  // d. Cantidad de objetos evadidos
  // e. Tiempo de toma de decisión

  binnacle = [
    {
      speed:100,
      distance:10,
      total_time:35,
      evaded_objects:3,
      decision_time:10
    },
    {
      speed:200,
      distance:15,
      total_time:25,
      evaded_objects:2,
      decision_time:4
    }
  ];

  constructor() { }

  ngOnInit() {
    this.mixItAll();
    console.log(this.binnacle);
  }

  mixItAll(){
    for(let x=0; x<=45; x++){
      let newbinnacle ={
        speed:this.getRandomInt(100,200),
        distance:this.getRandomInt(0,20),
        total_time:this.getRandomInt(5,60),
        evaded_objects:this.getRandomInt(1,10),
        decision_time:this.getRandomInt(6,30)
      };
      this.binnacle.push(newbinnacle);
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

}
