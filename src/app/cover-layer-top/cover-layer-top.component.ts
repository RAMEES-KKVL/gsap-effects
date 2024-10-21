import { AfterViewInit, Component } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-cover-layer-top',
  templateUrl: './cover-layer-top.component.html',
  styleUrls: ['./cover-layer-top.component.css']
})
export class CoverLayerTopComponent implements AfterViewInit {
  private hasUserScrolled = false;

  ngAfterViewInit(): void {
    let panels = gsap.utils.toArray(".panel")

    // Create ScrollTriggers for snapping
    let tops = panels.map(panel => ScrollTrigger.create({
      trigger : panel as gsap.DOMTarget,
      start : "top top"
    }))

    panels.forEach((panel: any) => {
      ScrollTrigger.create({
        trigger : panel,
        start : () => panel.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
        pin : true,
        pinSpacing : false
      })
    })

    window.addEventListener("scroll", () => this.hasUserScrolled = true)

    ScrollTrigger.create({
      snap : {
        snapTo : (progress, self) => {
          const scrolly = window.scrollY
          if ( !this.hasUserScrolled || scrolly < 50 ) return self?.scroll() || 0
          
          let panelStarts = tops.map(st => st.start).filter(Boolean) as number[],
              snapScroll = gsap.utils.snap(panelStarts, self?.scroll() ?? 0);
          return gsap.utils.normalize(0, ScrollTrigger.maxScroll(window), snapScroll || 0)
        },
        duration : 0.5
      }
    })
  }
}
