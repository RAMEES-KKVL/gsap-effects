import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParallaxBgComponent } from './parallax-bg/parallax-bg.component';
import { HscrollComponent } from './hscroll/hscroll.component';
import { NavLinkComponent } from './nav-link/nav-link.component';
import { InertiaComponent } from './inertia/inertia.component';

@NgModule({
  declarations: [
    AppComponent,
    ParallaxBgComponent,
    HscrollComponent,
    NavLinkComponent,
    InertiaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
