import { Component, OnInit, ViewChild, ElementRef, Host } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { GaugeChartModule } from 'angular-gauge-chart';

const STORAGE_KEY = 'routes';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  public chart: any;
  public count: number;
  public cantPas: number;
  public interval: any;

  public canvasWidth = 150
  public needleValue = 0
  public centralLabel = ''
  public name = 'Velocidad'
  public bottomLabel = '0'
  public options = {
    hasNeedle: true,
    needleColor: 'blue',
    needleUpdateSpeed: 1000,
    arcColors: ['green', 'yellow', 'red'],
    arcDelimiters: [33, 66],
    rangeLabel: ['0', '25'],
    needleStartValue: 0,
    outerNeedle: true
  }
  api_data: any = [];
  ruta;
  rutanueva;
  @ViewChild('imageCanvas', { static: true }) canvas: any;
  canvasElement: any;
  storedImages = [];

  constructor(private devhttp: HttpClient, private storage: Storage, private plt: Platform, private file: File) {
    this.storage.ready().then(
      () => {
        this.storage.get(STORAGE_KEY).then((data) => {
          if (data != undefined) this.storedImages = data;
        })
      }
    )
  }

  async getData() {
    const promise = this.devhttp.get('http://68.183.30.44:3001/api/Log').toPromise();
    await promise.then(
      res => {
        // console.log(res);
        this.api_data = res;
        let temp = this.api_data;
        this.api_data = [];
        for (let t of temp) {
          if (t['ruta'] == this.rutanueva) {
            this.api_data.push(t);
          }
        }
        // console.log(this.api_data);
        if (this.api_data.length == 0 && temp.length != 0) {
          this.saveImage();
          this.getLast();
        }
        // console.log(this.api_data);
      }).catch((err)=> console.log(err));
  }

  async getLast() {
    const promise = this.devhttp.get('http://68.183.30.44:3001/api/last').toPromise()
    await promise.then(
      res => {
        this.ruta = res;
        if (this.ruta.length != 0) this.ruta = res[0]['_id'];
      }
    ).catch((err) => console.log(err));
  }

  normalizeData() {
    for (let t of this.api_data) {
      let point;
      switch (t['direccion']) {
        case 0:
          point = { x: this.dataD[this.dataD.length - 1]['x'], y: this.dataD[this.dataD.length - 1]['y'] + t['distance'] };
          break;
        case 1:
          point = { x: this.dataD[this.dataD.length - 1]['x'], y: this.dataD[this.dataD.length - 1]['y'] - t['distance'] };
          break;
        case 2:
          point = { x: this.dataD[this.dataD.length - 1]['x'] + t['distance'], y: this.dataD[this.dataD.length - 1]['y'] };
          break;
        case 3:
          point = { x: this.dataD[this.dataD.length - 1]['x'] - t['distance'], y: this.dataD[this.dataD.length - 1]['y'] };
          break;
      }
      this.dataD.push(point);
    }
  }

  async ngOnInit() {
    this.dataD = [
      { x: 0, y: 0 }
    ];
    await this.getLast();
    this.rutanueva=this.ruta;
    await this.getData();
    this.normalizeData();
    //set values x, y
    if (this.api_data.length != 0) {
      this.needleValue = (this.api_data[this.api_data.length - 1]['speed']) * 20;
      this.bottomLabel = (this.needleValue / 20).toFixed(2) + "";
      if (this.needleValue < 33) this.options.needleColor = "green";
      else if (this.needleValue > 33 && this.needleValue < 66) this.options.needleColor = "yellow";
      else if (this.needleValue > 66) this.options.needleColor = "red";
    }
    setTimeout(() => {
      this.options.needleStartValue = this.needleValue;
    }, 1000);
    this.interval = setInterval(async () => {
      if (this.api_data.length != 0) {
        this.needleValue = (this.api_data[this.api_data.length - 1]['speed']) * 20;
        this.bottomLabel = this.needleValue / 20 + "";
        if (this.needleValue < 33) this.options.needleColor = "green";
        else if (this.needleValue > 33 && this.needleValue < 66) this.options.needleColor = "yellow";
        else if (this.needleValue > 66) this.options.needleColor = "red";
      }
      this.dataD = [
        { x: 0, y: 0 }
      ];
      await this.getLast();
      await this.getData();
      this.normalizeData();
      //updateValues x, y
      this.updateRecorrido();
      setTimeout(() => {
        this.options.needleStartValue = this.needleValue;
      }, 1500);
      if(this.rutanueva!=this.ruta){
        this.saveImage();
        this.rutanueva=this.ruta;
      }
    }, 3000);
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.height = this.plt.height() - 400;
    this.graficarRecorrido();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  dataD: any = [];

  updateRecorrido() {
    console.log(this.dataD);
    let pointBackgroundColors: any = [];
    let pointRadius: any = [];
    this.cantPas = this.count;

    // for (let i: number = 0; i < this.cantPas; i++) {
    //   dataD.push({ x: this.datos[i].x, y: this.datos[i].y });
    // }


    for (let i: number = 0; i < this.dataD.length; i++) {
      if (i == 0) {
        pointBackgroundColors[i] = 'black';
        pointRadius[i] = 3;
      } else if (i == (this.dataD.length - 1)) {
        pointBackgroundColors[i] = 'black';
        pointRadius[i] = 3;
      } else {
        pointBackgroundColors[i] = 'black';
        pointRadius[i] = 1;
      }

    }


    let maxX: number = 0;
    let minX: number = 0;
    let maxY: number = 0;
    let minY: number = 0;
    //dataD[i] = {x,y}
    for (let i: number = 0; i < this.dataD.length; i++) {

      if (this.dataD[i].x < minX) {
        minX = this.dataD[i].x;
      }
      if (this.dataD[i].x > maxX) {
        maxX = this.dataD[i].x;
      }
      if (this.dataD[i].y < minY) {
        minY = this.dataD[i].y;
      }
      if (this.dataD[i].y > maxY) {
        maxY = this.dataD[i].y;
      }
    }
    this.chart = new Chart('Recorrido', {
      type: 'scatter',
      animation: {
        duration: 0
      },
      data: {
        datasets: [{
          label: 'Recorrido (cm)',
          data: this.dataD,
          borderColor: 'green',
          borderWidth: 3,
          pointRadius: pointRadius,
          pointHoverRadius: 5,
          pointBackgroundColor: pointBackgroundColors,
          fill: false,
          showLine: true
        }]
      },
      options: {

        scales: {
          xAxes: [{
            ticks: {
              min: minX,
              max: maxX
            },
            gridLines: {
              color: '#888',
              drawOnChartArea: true
            }
          }],
          yAxes: [{
            ticks: {
              min: minY,
              max: maxY
            },
            gridLines: {
              color: '#888',
              drawOnChartArea: true
            }
          }]
        }
      }
    });
  }

  graficarRecorrido() {
    let pointBackgroundColors: any = [];
    let pointRadius: any = [];
    this.cantPas = this.count;

    // for (let i: number = 0; i < this.cantPas; i++) {
    //   dataD.push({ x: this.datos[i].x, y: this.datos[i].y });
    // }


    for (let i: number = 0; i < this.dataD.length; i++) {
      if (i == 0) {
        pointBackgroundColors[i] = 'blue';
        pointRadius[i] = 3;
      } else if (i == (this.dataD.length - 1)) {
        pointBackgroundColors[i] = 'red';
        pointRadius[i] = 3;
      } else {
        pointBackgroundColors[i] = 'black';
        pointRadius[i] = 1;
      }


    }


    let maxX: number = 0;
    let minX: number = 0;
    let maxY: number = 0;
    let minY: number = 0;
    //dataD[i] = {x,y}
    for (let i: number = 0; i < this.dataD.length; i++) {

      if (this.dataD[i].x < minX) {
        minX = this.dataD[i].x;
      }
      if (this.dataD[i].x > maxX) {
        maxX = this.dataD[i].x;
      }
      if (this.dataD[i].y < minY) {
        minY = this.dataD[i].y;
      }
      if (this.dataD[i].y > maxY) {
        maxY = this.dataD[i].y;
      }
    }
    // console.log('LIMITES', minX, maxX, minY, maxY);

    this.chart = new Chart('Recorrido', {
      type: 'scatter',
      animation: {
        duration: 0
      },
      data: {
        datasets: [{
          label: 'Recorrido (cm)',
          data: this.dataD,
          borderColor: 'green',
          borderWidth: 3,
          pointRadius: pointRadius,
          pointHoverRadius: 5,
          pointBackgroundColor: pointBackgroundColors,
          fill: false,
          showLine: true
        }]
      },
      options: {

        scales: {
          xAxes: [{
            ticks: {
              min: minX,
              max: maxX
            },
            gridLines: {
              color: '#888',
              drawOnChartArea: true
            }
          }],
          yAxes: [{
            ticks: {
              min: minY,
              max: maxY
            },
            gridLines: {
              color: '#888',
              drawOnChartArea: true
            }
          }]
        }
      }
    });
  }

  saveImage() {
    var dataUrl = this.canvasElement.toDataURL();
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    let name = new Date().getTime() + '.png';
    let path = this.file.dataDirectory;

    var data = dataUrl.split(',')[1];
    let blob = this.b64toBlob(data, 'image/png');

    try {
      this.file.writeFile(path, name, blob).then(res => {
        this.storeImage(dataUrl);
      }, err => {
        console.log(err);

      });
    } catch (e) {

    }
  }

  storeImage(imageName) {
    var dataUrl = this.canvasElement.toDataURL();
    let saveObj = { img: imageName };
    this.storedImages.push(saveObj);
    this.storage.set(STORAGE_KEY, this.storedImages).then(() => {
      //scroll to bottom
    });
  }

  removeImageAtIndex(index) {
    let removed = this.storedImages.splice(index, 1);
    this.file.removeFile(this.file.dataDirectory, removed[0].img).then(res => {

    },
      err => {

      });
    this.storage.set(STORAGE_KEY, this.storedImages);
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
