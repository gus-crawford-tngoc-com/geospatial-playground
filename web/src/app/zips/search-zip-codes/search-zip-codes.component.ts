import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { SearchZipsService, ZipCode } from '../search-zips.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-zip-codes',
  templateUrl: './search-zip-codes.component.html',
  styleUrl: './search-zip-codes.component.scss'
})
export class SearchZipCodesComponent implements OnInit,OnDestroy {
  public results?: ZipCode[];
  protected cleanUpOnDestroy = new Subscription();
  protected searchFilter = {
    expression: '',
    state: ''
  };
  constructor(public readonly zipSearch:SearchZipsService) { }

  @ViewChild('mapView')
  mapView?: ElementRef;
  @ViewChild('plotter')
  plotter?: ElementRef;
  ngOnInit(): void {
    this.cleanUpOnDestroy.add(
      this.zipSearch.zips.subscribe(
        zips=>{
          const atlas = {
            width: this.mapView?.nativeElement.clientWidth,
            height: this.mapView?.nativeElement.clientHeight,
            original: {
              width: this.mapView?.nativeElement.width,
              height: this.mapView?.nativeElement.height,
            }
          };
          this.clear();
          zips.forEach(
            (zip,n)=>n?zip:this.plot(zip.loc)
          );
          this.results = this.zipSearch.filterResults(zips, this.searchFilter.expression, this.searchFilter.state);
        },
        err=>{
          console.error(err);
        }
      )
    );
  }

  async search(subject:string) {
    const [expression, state] = (subject??'').split(/\s*,\s*/g);
    this.searchFilter = {expression, state};
    this.zipSearch.refreshZipCodes(expression);
  }

  ngOnDestroy(): void {
    this.cleanUpOnDestroy.unsubscribe();
  }
  /**
   * 1. Transform coords to 0 x 0 top-left origin plane
   * 2. Transform coords to scale
   */
  transformLongLatToPoint(
    /** logitude and lattitude (+/-180, +/-90) */
    [long, lat]:number[],
    /** (optional) the width and height of the "atlas projection image" being drawn on */
    [width, height]:number[]=[
      this.mapView?.nativeElement.clientWidth,
      this.mapView?.nativeElement.clientHeight
    ]) {
      const full = 360, /** 180 */ semi = full / 2, hemi = semi / 2;
      const scale = {
        x: width / full,
        y: height / semi
      };
      const conventionalOrigin= {
        x: semi + long,
        y: semi - (hemi + lat)
      };
      return [
      (conventionalOrigin.x * scale.x),
       (conventionalOrigin.y * scale.y)
      ]
  }
  transformPointToLongLat(
    /** logitude and lattitude (+/-180, +/-90) */
    [x, y]:number[],
    /** (optional) the width and height of the "atlas projection image" being drawn on */
    [width, height]:number[]=[
      this.mapView?.nativeElement.clientWidth,
      this.mapView?.nativeElement.clientHeight
    ]) {
      const full = 360, /** 180 */ semi = full / 2, hemi = semi / 2;
      const scale = {
        x: width / full,
        y: height / semi
      };
      const descaled = {
        x: x / scale.x,
        y: y / scale.y
      };
      return [
        descaled.x - semi,
        semi + (descaled.y - hemi)
      ];
  }

  clear() {
    (this.plotter as any).nativeElement.innerHTML = '';
  }
  plot([long, lat]:number[], offset=[0,-22]) {
    const canvas = this.plotter?.nativeElement;
    if (canvas) {
      const [x, y] = this.transformLongLatToPoint([long, lat]);
      const pin = document.createElement('div');
      pin.innerText = '📌';
      pin.style.position = 'absolute';
      pin.style.top = (y+offset[1])+'px';
      pin.style.left = (x+offset[0])+'px';
      canvas.appendChild(pin);
    }
  }
  isolate(zip:ZipCode) {
    this.clear();
    this.plot(zip.loc);
  }
}
