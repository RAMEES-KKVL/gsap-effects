import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParallaxBgComponent } from './parallax-bg/parallax-bg.component';
import { HscrollComponent } from './hscroll/hscroll.component';
import { NavLinkComponent } from './nav-link/nav-link.component';
import { InertiaComponent } from './inertia/inertia.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoverLayerTopComponent } from './cover-layer-top/cover-layer-top.component';
import { WaterFlowComponent } from './water-flow/water-flow.component';

@NgModule({
  declarations: [
    AppComponent,
    ParallaxBgComponent,
    HscrollComponent,
    NavLinkComponent,
    InertiaComponent,
    CoverLayerTopComponent,
    WaterFlowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
