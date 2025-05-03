import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import * as THREE from 'three'; 
import { WindowManagerService, WindowData } from './core/service/windowmanager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  // private camera!: THREE.OrthographicCamera;
  // private scene!: THREE.Scene;
  // private renderer!: THREE.WebGLRenderer;
  // private world!: THREE.Object3D;
  
  // private near!: number;
  // private far!: number;
  // private pixR: number = window.devicePixelRatio ? window.devicePixelRatio : 1;
  // private cubes: THREE.Mesh[] = [];
  // private sceneOffsetTarget = { x: 0, y: 0 };
  // private sceneOffset = { x: 0, y: 0 };
  
  // private today: number;
  // private animationFrameId?: number;
  // private initialized = false; 
  
  // constructor(
  //   private windowManagerService: WindowManagerService,
  //   private ngZone: NgZone
  // ) {
  //   // Set today to beginning of day
  //   const today = new Date();
  //   today.setHours(0);
  //   today.setMinutes(0);
  //   today.setSeconds(0);
  //   today.setMilliseconds(0);
  //   this.today = today.getTime();
  // }

  // ngOnInit(): void {
  //   // Check if we should clear localStorage
  //   const params = new URLSearchParams(window.location.search);
  //   if (params.get("clear")) {
  //     localStorage.clear();
  //   }

  //   // Add a short timeout to ensure window.offsetX reports correct values
  //   setTimeout(() => {
  //     this.setupScene();
  //     this.setupWindowManager();
  //     this.resize();
  //     this.updateWindowShape(false);
  //     this.startRendering();
  //     window.addEventListener('resize', () => this.resize());
  //   }, 500);
  // }

  // ngOnDestroy(): void {
  //   if (this.animationFrameId !== undefined) {
  //     cancelAnimationFrame(this.animationFrameId);
  //   }
  //   window.removeEventListener('resize', () => this.resize());
  // }

  // private setupScene(): void {
  //   this.camera = new THREE.OrthographicCamera(0, 0, window.innerWidth, window.innerHeight, -10000, 10000);
  //   this.camera.position.z = 2.5;
  //   this.near = this.camera.position.z - 0.5;
  //   this.far = this.camera.position.z + 0.5;

  //   this.scene = new THREE.Scene();
  //   this.scene.background = new THREE.Color(0.0);
  //   this.scene.add(this.camera);

  //   this.renderer = new THREE.WebGLRenderer({ antialias: true, depthBuffer: true });
  //   this.renderer.setPixelRatio(this.pixR);
  //   this.renderer.setSize(window.innerWidth, window.innerHeight);

  //   this.world = new THREE.Object3D();
  //   this.scene.add(this.world);

  //   this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  //   this.renderer.domElement.setAttribute("id", "scene");
  // }

  // private setupWindowManager(): void {
  //   // Set callbacks
  //   this.windowManagerService.setWinShapeChangeCallback(() => this.updateWindowShape());
  //   this.windowManagerService.setWinChangeCallback(() => this.windowsUpdated());

  //   // Custom metadata for this window
  //   const metaData = { foo: "bar" };

  //   // Initialize window manager
  //   this.windowManagerService.init(metaData);

  //   // Call update windows initially
  //   this.windowsUpdated();
  // }

  // private windowsUpdated(): void {
  //   this.updateNumberOfCubes();
  // }

  // private updateNumberOfCubes(): void {
  //   const wins = this.windowManagerService.getWindows();

  //   // Remove all cubes
  //   this.cubes.forEach((cube) => {
  //     this.world.remove(cube);
  //   });

  //   this.cubes = [];

  //   // Add new cubes based on the current window setup
  //   for (let i = 0; i < wins.length; i++) {
  //     const win = wins[i];

  //     const color = new THREE.Color();
  //     color.setHSL(i * 0.1, 1.0, 0.5);

  //     const size = 100 + i * 50;
  //     const cube = new THREE.Mesh(
  //       new THREE.BoxGeometry(size, size, size),
  //       new THREE.MeshBasicMaterial({ color: color, wireframe: true })
  //     );
      
  //     cube.position.x = win.shape.x + (win.shape.w * 0.5);
  //     cube.position.y = win.shape.y + (win.shape.h * 0.5);

  //     this.world.add(cube);
  //     this.cubes.push(cube);
  //   }
  // }

  // private updateWindowShape(easing: boolean = true): void {
  //   // Store the actual offset in a proxy that we update against in the render function
  //   this.sceneOffsetTarget = { x: -window.screenX, y: -window.screenY };
  //   if (!easing) {
  //     this.sceneOffset = { ...this.sceneOffsetTarget };
  //   }
  // }

  // private getTime(): number {
  //   return (new Date().getTime() - this.today) / 1000.0;
  // }

  // private startRendering(): void {
  //   this.ngZone.runOutsideAngular(() => {
  //     this.render();
  //   });
  // }

  // private render(): void {
  //   const t = this.getTime();

  //   this.windowManagerService.update();

  //   // Calculate the new position with a smooth falloff
  //   const falloff = 0.05;
  //   this.sceneOffset.x = this.sceneOffset.x + ((this.sceneOffsetTarget.x - this.sceneOffset.x) * falloff);
  //   this.sceneOffset.y = this.sceneOffset.y + ((this.sceneOffsetTarget.y - this.sceneOffset.y) * falloff);

  //   // Set the world position to the offset
  //   this.world.position.x = this.sceneOffset.x;
  //   this.world.position.y = this.sceneOffset.y;

  //   const wins = this.windowManagerService.getWindows();

  //   // Update cube positions based on current window positions
  //   for (let i = 0; i < this.cubes.length; i++) {
  //     const cube = this.cubes[i];
  //     const win = wins[i];
  //     const _t = t; // + i * 0.2;

  //     const posTarget = { 
  //       x: win.shape.x + (win.shape.w * 0.5), 
  //       y: win.shape.y + (win.shape.h * 0.5) 
  //     };

  //     cube.position.x = cube.position.x + (posTarget.x - cube.position.x) * falloff;
  //     cube.position.y = cube.position.y + (posTarget.y - cube.position.y) * falloff;
  //     cube.rotation.x = _t * 0.5;
  //     cube.rotation.y = _t * 0.3;
  //   }

  //   this.renderer.render(this.scene, this.camera);
  //   this.animationFrameId = requestAnimationFrame(() => this.render());
  // }

  // private resize(): void {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
    
  //   this.camera = new THREE.OrthographicCamera(0, width, 0, height, -10000, 10000);
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(width, height);
  // }



  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private camera!: THREE.OrthographicCamera;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private world!: THREE.Object3D;
  
  private near!: number;
  private far!: number;
  private pixR: number = window.devicePixelRatio ? window.devicePixelRatio : 1;
  private cubes: THREE.Mesh[] = [];
  private sceneOffsetTarget = { x: 0, y: 0 };
  private sceneOffset = { x: 0, y: 0 };
  
  private today: number;
  private animationFrameId?: number;
  private initialized = false;
  
  constructor(
    private windowManagerService: WindowManagerService,
    private ngZone: NgZone
  ) {
    // Set today to beginning of day
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    this.today = today.getTime();
  }

  ngOnInit(): void {
    // Check if we should clear localStorage
    const params = new URLSearchParams(window.location.search);
    if (params.get("clear")) {
      localStorage.clear();
    }

    // Add a short timeout to ensure window.offsetX reports correct values
    setTimeout(() => {
      this.setupScene();
      this.setupWindowManager();
      this.resize();
      this.updateWindowShape(false);
      this.startRendering();
      window.addEventListener('resize', () => this.resize());
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', () => this.resize());
  }

  private setupScene(): void {
    this.camera = new THREE.OrthographicCamera(0, 0, window.innerWidth, window.innerHeight, -10000, 10000);
    this.camera.position.z = 2.5;
    this.near = this.camera.position.z - 0.5;
    this.far = this.camera.position.z + 0.5;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0.0);
    this.scene.add(this.camera);

    // Fix: Replace 'depthBuffer' with correct parameters
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(this.pixR);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.world = new THREE.Object3D();
    this.scene.add(this.world);

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute("id", "scene");
  }

  private setupWindowManager(): void {
    // Set callbacks
    this.windowManagerService.setWinShapeChangeCallback(() => this.updateWindowShape());
    this.windowManagerService.setWinChangeCallback(() => this.windowsUpdated());

    // Custom metadata for this window
    const metaData = { foo: "bar" };

    // Initialize window manager
    this.windowManagerService.init(metaData);

    // Call update windows initially
    this.windowsUpdated();
  }

  private windowsUpdated(): void {
    this.updateNumberOfCubes();
  }

  private updateNumberOfCubes(): void {
    const wins = this.windowManagerService.getWindows();

    // Remove all cubes
    this.cubes.forEach((cube) => {
      this.world.remove(cube);
    });

    this.cubes = [];

    // Add new cubes based on the current window setup
    for (let i = 0; i < wins.length; i++) {
      const win = wins[i];

      const color = new THREE.Color();
      color.setHSL(i * 0.1, 1.0, 0.5);

      const size = 100 + i * 50;
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshBasicMaterial({ color: color, wireframe: true })
      );
      
      cube.position.x = win.shape.x + (win.shape.w * 0.5);
      cube.position.y = win.shape.y + (win.shape.h * 0.5);

      this.world.add(cube);
      this.cubes.push(cube);
    }
  }

  private updateWindowShape(easing: boolean = true): void {
    // Store the actual offset in a proxy that we update against in the render function
    this.sceneOffsetTarget = { x: -window.screenX, y: -window.screenY };
    if (!easing) {
      this.sceneOffset = { ...this.sceneOffsetTarget };
    }
  }

  private getTime(): number {
    return (new Date().getTime() - this.today) / 1000.0;
  }

  private startRendering(): void {
    this.ngZone.runOutsideAngular(() => {
      this.render();
    });
  }

  private render(): void {
    const t = this.getTime();

    this.windowManagerService.update();

    // Calculate the new position with a smooth falloff
    const falloff = 0.05;
    this.sceneOffset.x = this.sceneOffset.x + ((this.sceneOffsetTarget.x - this.sceneOffset.x) * falloff);
    this.sceneOffset.y = this.sceneOffset.y + ((this.sceneOffsetTarget.y - this.sceneOffset.y) * falloff);

    // Set the world position to the offset
    this.world.position.x = this.sceneOffset.x;
    this.world.position.y = this.sceneOffset.y;

    const wins = this.windowManagerService.getWindows();

    // Update cube positions based on current window positions
    for (let i = 0; i < this.cubes.length; i++) {
      const cube = this.cubes[i];
      const win = wins[i];
      const _t = t; // + i * 0.2;

      const posTarget = { 
        x: win.shape.x + (win.shape.w * 0.5), 
        y: win.shape.y + (win.shape.h * 0.5) 
      };

      cube.position.x = cube.position.x + (posTarget.x - cube.position.x) * falloff;
      cube.position.y = cube.position.y + (posTarget.y - cube.position.y) * falloff;
      cube.rotation.x = _t * 0.5;
      cube.rotation.y = _t * 0.3;
    }

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera = new THREE.OrthographicCamera(0, width, 0, height, -10000, 10000);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}