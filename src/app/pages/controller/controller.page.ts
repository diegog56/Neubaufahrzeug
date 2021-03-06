import { Component, OnInit, OnDestroy } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.page.html',
  styleUrls: ['./controller.page.scss'],
})
export class ControllerPage implements OnInit, OnDestroy {

  url = 'ws://68.183.30.44:3001/';
  socket = webSocket(this.url);

  color = "success";
  mode = "Presione iniciar";
  left_icon = "fas fa-eye";
  right_icon = "fas fa-eye";

  constructor() { }

  ngOnInit() {
    this.socket.subscribe();
  }

  ngOnDestroy(){
    this.socket.complete();
  }

  accion(a){
    console.log(a);
    this.socket.next(+a);
    switch(a){
      case "5":
        this.mode = "Eliga un modo";
        this.color = "success";
        this.left_icon = "fas fa-eye";
        this.right_icon = "fas fa-eye";
        break;
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
      case "7":
          this.left_icon="fas fa-route";
          this.right_icon="fas fa-tachometer-alt";
          this.mode="Carrera";
          this.color="yellow";
          break;
    }
  }


}
