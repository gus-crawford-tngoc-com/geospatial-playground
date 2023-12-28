import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchZipCodesComponent } from './search-zip-codes/search-zip-codes.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {
    path:'',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchZipCodesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZipsRoutingModule { }
