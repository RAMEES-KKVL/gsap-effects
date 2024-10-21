import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
@Component({
  selector: 'app-parallax-bg',
  templateUrl: './parallax-bg.component.html',
  styleUrls: ['./parallax-bg.component.css']
})
export class ParallaxBgComponent implements AfterViewInit {
  @ViewChildren("bgClass", { read: ElementRef }) bgSection!: QueryList<ElementRef>
  
  ngAfterViewInit(): void {
    this.bgSection.forEach((section: ElementRef, i: number) => {
      const element = section.nativeElement;
      const bgImg = element.querySelector(`.bg-img_${i + 1}`);
      
      const getRatio = (el: HTMLElement) => window.innerHeight / (window.innerHeight + el.offsetHeight);
      
      gsap.fromTo(bgImg, {
        backgroundPosition: `50% ${-window.innerHeight * getRatio(element)}px`,
      }, {
        backgroundPosition: `50% ${window.innerHeight * (1 - getRatio(element))}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          scrub: true,
          invalidateOnRefresh: true
        }
      });
    });
  }
}
