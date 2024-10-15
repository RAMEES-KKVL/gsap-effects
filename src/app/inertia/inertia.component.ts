import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Draggable, ScrollTrigger);

@Component({
  selector: 'app-inertia',
  templateUrl: './inertia.component.html',
  styleUrls: ['./inertia.component.css']
})
export class InertiaComponent implements AfterViewInit {
  @ViewChild("ball", { static: true }) ball!: ElementRef;

  friction = 0.95; // Friction to reduce velocity over time
  velocityX = 0;
  velocityY = 0;
  lastX = 0;
  lastY = 0;
  isDragging = false;
  vw = window.innerWidth;
  vh = window.innerHeight;

  ngAfterViewInit(): void {
    this.initializeBall();
    this.setupDraggable();
  }

  initializeBall() {
    gsap.set(this.ball.nativeElement, {
      xPercent: -50,
      yPercent: -50,
      x: this.vw / 2,
      y: this.vh / 2
    });

    window.addEventListener("resize", () => {
      this.vw = window.innerWidth;
      this.vh = window.innerHeight;
    });
  }

  setupDraggable() {
    Draggable.create(this.ball.nativeElement, {
      bounds: window,
      onPress: () => {
        gsap.killTweensOf(this.ball.nativeElement);
        this.isDragging = true;
      },
      onDrag: () => {
        this.trackVelocity();
      },
      onRelease: () => {
        this.isDragging = false;
        this.applyInertia();
      }
    });
  }

  trackVelocity() {
    const currentX = gsap.getProperty(this.ball.nativeElement, "x") as number;
    const currentY = gsap.getProperty(this.ball.nativeElement, "y") as number;

    // Calculate the velocity based on the difference in position
    this.velocityX = currentX - this.lastX;
    this.velocityY = currentY - this.lastY;

    // Update last known position for the next calculation
    this.lastX = currentX;
    this.lastY = currentY;
  }

  applyInertia() {
    const animate = () => {
      if (this.isDragging) return; // Stop inertia if the user starts dragging again

      // Apply friction to slow down the velocity gradually
      this.velocityX *= this.friction;
      this.velocityY *= this.friction;

      // Update the ball's position based on velocity
      const currentX = (gsap.getProperty(this.ball.nativeElement, "x") as number) + this.velocityX;
      const currentY = (gsap.getProperty(this.ball.nativeElement, "y") as number) + this.velocityY;

      // Check boundaries and handle collision bounce
      this.checkBounds(currentX, currentY);

      // Continue animation as long as the ball is moving
      if (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1) {
        requestAnimationFrame(animate);
      }
    };

    animate(); // Start the inertia animation loop
  }

  checkBounds(x: number, y: number) {
    const radius = this.ball.nativeElement.getBoundingClientRect().width / 2;
    
    let vx = this.velocityX;
    let vy = this.velocityY;

    // Check and handle collisions with the right and left walls
    if (x + radius > this.vw) {
      x = this.vw - radius;
      vx *= -1;  // Reverse direction when hitting the right wall
    } else if (x - radius < 0) {
      x = radius;
      vx *= -1;  // Reverse direction when hitting the left wall
    }

    // Check and handle collisions with the bottom and top walls
    if (y + radius > this.vh) {
      y = this.vh - radius;
      vy *= -1;  // Reverse direction when hitting the bottom wall
    } else if (y - radius < 0) {
      y = radius;
      vy *= -1;  // Reverse direction when hitting the top wall
    }

    // Update the ball's position using GSAP
    gsap.set(this.ball.nativeElement, { x, y });

    // Update velocity after potential collision
    this.velocityX = vx;
    this.velocityY = vy;
  }

  setupScrollTriggers(container1: ElementRef, container2: ElementRef, container3: ElementRef) {
    // Scroll trigger for container 1
    ScrollTrigger.create({
      trigger : container1.nativeElement,
      start : "top center",
      onEnter : () => {
        this.moveBallToContainer(container1.nativeElement)
      }
    })

    // Scroll trigger for container 2
    ScrollTrigger.create({
      trigger : container2.nativeElement,
      start : "top center",
      onEnter : () => {
        this.moveBallToContainer(container2.nativeElement)
      }
    })

      // Scroll trigger for container 3
      ScrollTrigger.create({
        trigger : container3.nativeElement,
        start : "top center",
        onEnter : () => {
          this.moveBallToContainer(container3.nativeElement)
        }
      })
  }

  moveBallToContainer(container: HTMLElement) {
    const containerBounds = container.getBoundingClientRect();
    const containerCenterX = containerBounds.left + containerBounds.width / 2;
    const containerCenterY = containerBounds.top + containerBounds.height / 2;

    gsap.to(this.ball.nativeElement, {
      x: containerCenterX - this.vw / 2,
      y: containerCenterY - this.vh / 2,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete : () => this.applyInertia()  // After moving to the container, inertia should continue smoothly 
    });
  }  
}
