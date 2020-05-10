import { Component, OnInit, ViewChild, ElementRef, Host } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-relations',
  templateUrl: './relations.page.html',
  styleUrls: ['./relations.page.scss'],
})
export class RelationsPage implements OnInit {

  @ViewChild('svg', null) svgRef: ElementRef<SVGElement>;
  loading = false;
  title = "Velocidad vs Velocidad";
  subtitle = "Puedes seleccionar otra relación";
  xAxisProp = 'speed';
  yAxisProp = 'speed';
  ruta = "0";
  api_data: any = [];
  constructor(@Host() private host: ElementRef<HTMLElement>, private devhttp: HttpClient) { }

  ngOnInit() {
    this.getData();
  }

  rutas: any = [];

  getData() {
    this.devhttp.get('http://68.183.30.44:3001/api/Log').subscribe(
      res => {
        this.api_data = res;
        this.setData(this.xAxisProp, this.yAxisProp);
      },
      err => console.log(err)
    )
    this.devhttp.get('http://68.183.30.44:3001/api/new').subscribe(
      res => {
        this.rutas = res;
      },
      err => console.log(err)
    )
  }

  updateChart() {
    switch (this.xAxisProp) {
      case "speed":
        this.title = "Velocidad vs "
        break;
      case "distance":
        this.title = "Distancia vs "
        break;
      case "total_time":
        this.title = "Tiempo vs "
        break;
      case "evaded_objects":
        this.title = "Objetos Evadidos vs "
        break;
      case "knockeddown_objects":
        this.title = "Objetos Derribados vs "
        break;
      case "objects":
        this.title = "Objetos vs "
        break;
      case "decision_time":
        this.title = "Tiempo de Decision vs "
        break;
    }
    switch (this.yAxisProp) {
      case "speed":
        this.title += "Velocidad"
        break;
      case "distance":
        this.title += "Distancia"
        break;
      case "total_time":
        this.title += "Tiempo"
        break;
      case "evaded_objects":
        this.title += "Objetos Evadidos"
        break;
      case "knockeddown_objects":
        this.title += "Objetos Derribados"
        break;
      case "objects":
        this.title += "Objetos"
        break;
      case "decision_time":
        this.title += "Tiempo de Decision"
        break;
    }
    this.setData(this.xAxisProp, this.yAxisProp);
  }

  data = [];
  setData(xAxis, yAxis) {
    this.data = [];
    for (let d of this.api_data) {
      let x;
      let y;
      if (this.ruta=="0" || this.ruta==d['ruta']) {
        if (xAxis != "objects") x = d[xAxis];
        else x = d['evaded_objects'] + d['knockeddown_objects'];
        if (yAxis != "objects") y = d[yAxis];
        else y = d['evaded_objects'] + d['knockeddown_objects'];
        let newdata = { data: x, y: y };
        this.data.push(newdata);
      }
    }
    this.data.sort((a, b) => {
      const valA = a['data'];
      const valB = b['data'];
      return valA > valB ? -1 : valA < valB ? 1 : 0;
    });
    console.log(this.data);
    this.loadChart();
  }

  loadChart() {
    // this.randomizeData();
    const data = [
      this.data,
      this.data
    ];
    const { width } = this.host.nativeElement.getBoundingClientRect();
    const height = width / (10 / 9);
    const margin = Math.min(Math.max(width * 0.1, 20), 50);

    const svg = d3.select(this.svgRef.nativeElement)
    this.drawChart(svg, width, height, margin, data);
    fromEvent(window, 'resize')
      .pipe(
        tap(() => this.loading = true),
        debounceTime(300)
      ).subscribe(() => {
        const { width } = this.host.nativeElement.getBoundingClientRect();
        const height = width / (16 / 9);
        const margin = Math.min(Math.max(width * 0.1, 20), 50);
        this.drawChart(svg, width, height, margin, data);
        this.loading = false;
      });

  }

  private drawChart(svg: any, width: number, height: number, margin: number, data: any[]) {
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    const n = data[0].length;
    const maxX = Math.max.apply(Math, data[0].map(function (o) { return o['data']; }));
    const maxY = Math.max.apply(Math, data[0].map(function (o) { return o['y']; }));
    const maxValue = maxY;

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid');

    svg.selectAll('g').remove();

    const xScale = d3.scaleLinear()
      .domain([0, maxX])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, maxY])
      .range([chartHeight, 0]);

    const line = d3.line()
      .defined(d => !isNaN(d.data))
      .x((d, i) => xScale(d.data))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX)

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${margin}, ${chartHeight + margin})`)
      .call(d3.axisBottom(xScale).ticks(Math.min(Math.floor(chartWidth / 25), n)));

    svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${margin}, ${margin})`)
      .call(d3.axisLeft(yScale).ticks(Math.min(Math.floor(chartHeight / 15), maxValue)));

    const colors = ['steelblue', 'red'];

    data.forEach((serie, i) => {
      svg
        .append('g')
        .attr('transform', `translate(${margin}, ${margin})`)
        .append('path')
        .datum(serie)
        .attr('fill', 'none')
        .attr('stroke', colors[i])
        .attr('stroke-width', 3)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('class', 'line')
        .attr('d', line)
    });
  }

}
