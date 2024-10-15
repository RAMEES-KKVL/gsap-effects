import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
// import { InertiaComponent } from './inertia/inertia.component';

gsap.registerPlugin(ScrollTrigger, Draggable)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
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

      // Recenter the ball when resizing occurs
      gsap.set(this.ball.nativeElement, {
        x: this.vw / 2,
        y: this.vh / 2
      });

      this.velocityX = 0;
      this.velocityY = 0;
      this.lastX = this.vw / 2;
      this.lastY = this.vh / 2;
    });
  }

  setupDraggable() {
    Draggable.create(this.ball.nativeElement, {
      type : "x,y",
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
}

