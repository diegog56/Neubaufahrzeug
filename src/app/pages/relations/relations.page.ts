import { Component, OnInit, ViewChild, ElementRef, Host } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import * as d3 from 'd3';

@Component({
  selector: 'app-relations',
  templateUrl: './relations.page.html',
  styleUrls: ['./relations.page.scss'],
})
export class RelationsPage implements OnInit {

  @ViewChild('svg',null) svgRef: ElementRef<SVGElement>;
  loading = false;
  title="Relaciones";
  subtitle="Tiempo vs Decision"
  constructor(@Host() private host: ElementRef<HTMLElement>) {}

  ngOnInit(){

  }
  data = [];
  randomizeData(){
    for(let x=0;x<50;x++){
      let d = {data:this.getRandomArbitrary(0,50),y:this.getRandomArbitrary(0,5)};
      this.data.push(d);
    }
    this.data.sort((a, b) => {
      const valA = a['data'];
      const valB = b['data'];
      return valA > valB ? -1 : valA < valB ? 1 : 0;
    });
  } 

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  ngAfterViewInit() {
    this.randomizeData();
    const data = [
      this.data,
        this.data
    ];
    console.log(data);
    const { width } = this.host.nativeElement.getBoundingClientRect();
    const height = width / (16/9);
    const margin = Math.min(Math.max(width * 0.1, 20), 50);

    const svg = d3.select(this.svgRef.nativeElement)
    this.drawChart(svg, width, height, margin, data);
    fromEvent(window, 'resize')
      .pipe(
        tap(() => this.loading = true),
        debounceTime(300)
      ).subscribe(() => {
        const { width } = this.host.nativeElement.getBoundingClientRect();
        const height = width / (16/9);
        const margin = Math.min(Math.max(width * 0.1, 20), 50);
        this.drawChart(svg, width, height, margin, data);
        this.loading = false;
      });
      
  }

  private drawChart(svg: any, width: number, height: number, margin: number, data: any[]) {
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    const n = data[0].length;
    const maxX=Math.max.apply(Math, data[0].map(function(o) { return o['data']; }));
    const maxY=Math.max.apply(Math, data[0].map(function(o) { return o['y']; }));
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

    const colors = ['steelblue', 'orange'];

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
