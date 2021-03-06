import { Component, OnInit } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {

  sortdirection = 0;
  sortkey = null;

  binnacle: any = [
  ];

  constructor(private toastCtrl: ToastController,  private devhttp:HttpClient) { }

  ngOnInit() {
    // this.mixItAll();
    this.getData();
  }

  sortBy(key) {
    if (key != this.sortkey) this.sortdirection = 0;
    this.sortkey = key;
    this.sortdirection++;
    if (this.sortdirection == 1) {
      this.binnacle.sort((a, b) => {
        const valA = a[this.sortkey];
        const valB = b[this.sortkey];
        return valA > valB ? -1 : valA < valB ? 1 : 0;
      });
    } else if (this.sortdirection == 2) {
      this.binnacle.sort((a, b) => {
        const valA = a[this.sortkey];
        const valB = b[this.sortkey];
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      });
    } else {
      this.sortdirection = 0;
      this.sortkey = null;
      this.binnacle.sort((a, b) => {
        const valA = a['_id'];
        const valB = b['_id'];
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      });
    }
  }

  mixItAll() {
    let d;
    let i = 0;
    for (let x = 0; x <= 45; x++) {
      d = new Date(+x * this.getRandomInt(1000, 50000));
      let newbinnacle = {
        index: ++i,
        speed: this.getRandomInt(100, 200),
        distance: this.getRandomInt(0, 20),
        total_time: this.getRandomInt(5, 60),
        evaded_objects: this.getRandomInt(1, 10),
        decision_time: this.getRandomInt(6, 30),
        date: (d.getMonth() + 1) + "-" + d.getDate() + " " + this.appendLeadingZeroes(d.getHours()) + ":" + this.appendLeadingZeroes(d.getMinutes()) + ":" + this.appendLeadingZeroes(d.getSeconds())
      };
      this.binnacle.push(newbinnacle);
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }

  getData() {
      this.devhttp.get('http://68.183.30.44:3001/api/Log').subscribe(
        res => this.binnacle=res,
        err => console.log(err)
      )
  }

  //debugger

  bug() {
    // this.getData();
  }

  async presentMessage(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 6000,
      color: "red"
    });
    toast.present();
  }

}
