import { Routes } from '@angular/router';
import { SearchZipCodesComponent } from './zips/search-zip-codes/search-zip-codes.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
      import('./zips/zips.module').then((m) => m.ZipsModule)
    }
];
