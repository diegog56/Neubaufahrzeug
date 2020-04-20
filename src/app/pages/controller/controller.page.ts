import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.page.html',
  styleUrls: ['./controller.page.scss'],
})
export class ControllerPage implements OnInit {
  color="orange";
  mode="Derribar";
  left_icon="fas fa-level-down-alt";
  right_icon="fab fa-jedi-order";

  constructor() { }

  ngOnInit() {
  }

  accion(a){
    console.log(a);
    switch(a){
      case "1":
        this.color="orange";
        this.mode="Derribar";
        this.left_icon="fas fa-level-down-alt";
        this.right_icon="fab fa-jedi-order";
        break;
      case "2":
        this.left_icon="fas fa-hand-paper";
        this.right_icon="fas fa-biohazard";
        this.mode="Detener";
        this.color="dark";
        break;
      case "3":
        this.left_icon="fas fa-route";
        this.right_icon="fas fa-tachometer-alt";
        this.mode="Evitar";
        this.color="yellow";
        break;
      case "4":
        this.left_icon="fas fa-radiation";
        this.right_icon="fas fa-skull-crossbones";
        this.mode="Atacar";
        this.color="red";
        break;
    }
  }


}
