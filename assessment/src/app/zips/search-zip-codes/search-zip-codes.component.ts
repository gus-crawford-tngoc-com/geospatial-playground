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
          console.info(atlas);
          this.plotter?.nativeElement.getContext("2d").clearRect(0, 0, atlas.width, atlas.height);
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
  transformPoint(
    /** logitude and lattitude (+/-180, +/-90) */
    [long, lat]:number[],
    /** (optional) the width and height of the "atlas projection image" being drawn on */
    [width, height]:number[]=[
      this.mapView?.nativeElement.clientWidth,
      this.mapView?.nativeElement.clientHeight
    ]) {
      const full = 360, semi = full / 2, hemi = semi / 2;
      const conventionalOrigin= {
        x: long + semi,
        y: hemi - lat
      };
      const scale = {
        x: width / full,
        y: height / semi
      };
      return [
        conventionalOrigin.x * scale.x,
        conventionalOrigin.y * scale.y
      ]
  }
  plot([long, lat]:number[]) {
    const canvas = this.plotter?.nativeElement;
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
  
      // ctx.fillRect(25, 25, 100, 100);
      // ctx.clearRect(45, 45, 60, 60);
      ctx.fillStyle = 'white';
      const [x, y] = this.transformPoint([long, lat])
      ctx.strokeRect(x, y, 5, 5);
    }
  }
}
