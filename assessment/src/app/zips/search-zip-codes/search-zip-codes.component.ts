import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SearchZipsService, ZipCode } from '../search-zips.service';

@Component({
  selector: 'app-search-zip-codes',
  templateUrl: './search-zip-codes.component.html',
  styleUrl: './search-zip-codes.component.scss'
})
export class SearchZipCodesComponent {
  public results?: ZipCode[];
  constructor(public readonly zipSearch:SearchZipsService) { }
  async search(subject:string) {
    const [exp, state] = (subject??'').split(/\s*,\s*/g);
    this.zipSearch.zips.subscribe(
      zips=>{
        this.results = this.zipSearch.filterResults(zips, exp, state);
      },
      err=>{
        console.error(err);
      }
    );
    this.zipSearch.refreshZipCodes();
  }
}
