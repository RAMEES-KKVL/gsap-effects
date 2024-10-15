import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hscroll',
  templateUrl: './hscroll.component.html',
  styleUrls: ['./hscroll.component.css']
})
export class HscrollComponent implements AfterViewInit {
  duration = 10;
  sections: any[] = [];

  @ViewChild("hScroll", { static: true }) hScrollContainer!: ElementRef;

  ngAfterViewInit(): void {
    // Get the scroll container and sections
    const hScroll = this.hScrollContainer.nativeElement;
    this.sections = gsap.utils.toArray(".panel", hScroll); // Assumes panels have the class "panel"
    const sectionIncrement = this.duration / (this.sections.length - 1);

    // Create timeline for horizontal scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hScroll,
        pin: true,
        scrub: 0.5,
        snap: 1 / (this.sections.length - 1),
        start: "top top",
        end: "+=8000",
      }
    });

    // Animate the sections horizontally
    tl.to(this.sections, {
      xPercent: -100 * (this.sections.length - 1),
      duration: this.duration,
      ease: "none"
    });

    // Loop through sections to apply individual animations
    this.sections.forEach((section, index) => {
      let tween = gsap.from(section, {
        opacity: 0,
        scale: 0.6,
        duration: 1,
        force3D: true,
        paused: true
      });

      // Add section callbacks for entering and leaving animations
      this.addSectionCallbacks(tl, {
        start: sectionIncrement * (index - 0.99),
        end: sectionIncrement * (index + 0.99),
        onEnter: () => tween.play(),
        onLeave: () => tween.reverse(),
        onEnterBack: () => tween.play(),
        onLeaveBack: () => tween.reverse(),
      });

      // Ensure the first section animation is immediately completed
      index === 0 && tween.progress(1);
    });
  }

  addSectionCallbacks(timeline: gsap.core.Timeline, config: { start: number, end: number, onEnter: () => void, onLeave: () => void, onEnterBack: () => void, onLeaveBack: () => void }): void {
    const { start, end, onEnter, onLeave, onEnterBack, onLeaveBack } = config;

    const trackDirection = (animation: gsap.core.Timeline) => {
      let prevTime = animation.time();
      animation['direction'] = animation.reversed() ? -1 : 1;

      animation.eventCallback("onUpdate", () => {
        let time = animation.time();
        animation['direction'] = time < prevTime ? -1 : 1;
        prevTime = time;
      });
    };

    const empty = (v: any) => v;

    if (!timeline['direction']) {
      trackDirection(timeline);
    }

    if (start >= 0) {
      timeline.add(() => ((timeline['direction'] < 0 ? onLeaveBack : onEnter) || empty)(), start);
    }

    if (end <= timeline.duration()) {
      timeline.add(() => ((timeline['direction'] < 0 ? onEnterBack : onLeave) || empty)(), end);
    }
  }
}














































