import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), importProvidersFrom(CommonModule), importProvidersFrom(BrowserModule)]
};
if (!window.localStorage.getItem("candidate")) {
  window.localStorage.setItem("candidate", prompt("Please enter your name") as string);
  window.localStorage.setItem("start", (new Date()).toString())
}