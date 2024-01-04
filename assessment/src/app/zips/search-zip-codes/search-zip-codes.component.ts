import { Component, OnDestroy, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.cleanUpOnDestroy.add(
      this.zipSearch.zips.subscribe(
        zips=>{
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
    this.zipSearch.refreshZipCodes();
  }

  ngOnDestroy(): void {
    this.cleanUpOnDestroy.unsubscribe();
  }
}
