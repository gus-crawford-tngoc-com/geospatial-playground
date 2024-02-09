import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZipsRoutingModule } from './zips-routing.module';
import { SearchZipCodesComponent } from './search-zip-codes/search-zip-codes.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchZipsService } from './search-zips.service';


@NgModule({
  declarations: [SearchZipCodesComponent],
  imports: [
    CommonModule,
    ZipsRoutingModule
  ],
  providers: [SearchZipsService]
})
export class ZipsModule { }
