import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParallaxBgComponent } from './parallax-bg/parallax-bg.component';
import { NavLinkComponent } from './nav-link/nav-link.component';
import { HscrollComponent } from './hscroll/hscroll.component';
import { InertiaComponent } from './inertia/inertia.component';
import { AppComponent } from './app.component';
import { CoverLayerTopComponent } from './cover-layer-top/cover-layer-top.component';

const routes: Routes = [
  {
    path : "", component : AppComponent
  },
  {
    path : "inertia", component : InertiaComponent
  },
  {
    path : "navlink", component : NavLinkComponent
  },
  {
    path : "parallax", component : ParallaxBgComponent
  },
  {
    path : "Hscroll", component : HscrollComponent
  },
  {
    path : "cover-layer", component : CoverLayerTopComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
