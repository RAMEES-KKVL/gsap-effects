import { Component, ElementRef, ViewChild } from '@angular/core';
import { Camera, Program, Renderer, Triangle, Vec3, Mesh, Transform } from 'ogl';

interface BallParams {
  st: number;
  dtFactor: number;
  baseScale: number;
  toggle: number;
  radius: number;
}

@Component({
  selector: 'app-water-flow',
  templateUrl: './water-flow.component.html',
  styleUrls: ['./water-flow.component.css']
})
export class WaterFlowComponent {
@ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLDivElement>;

  color = '#188c4a';
  speed = 0.3;
  enableMouseInteraction = true;
  hoverSmoothness = 0.05;
  animationSize = 30;
  ballCount = 15;
  clumpFactor = 1;
  cursorBallSize = 3;
  cursorBallColor = '#02e866';
  enableTransparency = false;

  animationFrameId?: number;
  metaBallsUniform: Vec3[] = [];
  ballParams: BallParams[] = [];
  mouseBallPops = {x: 0, y: 0}; // Correct property name
  pointerInside = false;
  pointerX = 0;
  pointerY = 0;
  starttime = 0; // Correct property name
  gl!: any;
  renderer!: Renderer;
  program!: Program;
  private scene!: Transform;
  private camera!: Camera;

  ngOnInit(): void {
    this.initializeWebGL();
  }

  initializeWebGL(): void {
    const container = this.containerRef.nativeElement;

    this.camera = new Camera(this.gl, {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 0.1,
      far: 10,
    });
    this.camera.position.z = 1; 

    const dpr = 1;
    this.renderer = new Renderer({
      dpr,
      alpha: true,
      premultipliedAlpha: false,
    });

    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, this.enableTransparency ? 0 : 1);
    container.appendChild(this.gl.canvas);

    const camera = new Camera(this.gl, {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 0.1,
      far: 10,
    });
    camera.position.z = 1;

    const geometry = new Triangle(this.gl);
    const [r1, g1, b1] = this.parseHexColor(this.color);
    const [r2, g2, b2] = this.parseHexColor(this.cursorBallColor);

    // Initialize metaBalls uniform array
    for (let i = 0; i < 50; i++) {
      this.metaBallsUniform.push(new Vec3(0, 0, 0));
    }

    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) },
        iColor: { value: new Vec3(r1, g1, b1) },
        iCursorColor: { value: new Vec3(r2, g2, b2)}, // Make sure this matches the shader
        iAnimationSize: { value: this.animationSize},
        iBallCount: { value: this.ballCount},
        iCursorBallSize: { value: this.cursorBallSize},
        iMetaBalls: { value: this.metaBallsUniform},
        iClumpFactor: { value: this.clumpFactor},
        enableTransparency: { value: this.enableTransparency},
      }
    })

    const mesh = new Mesh(this.gl, {geometry, program: this.program});
    this.scene = new Transform();
    mesh.setParent(this.scene);

    const maxBalls = 50;
    const effectiveBallCount = Math.min(this.ballCount, maxBalls);

    for (let i = 0; i < effectiveBallCount; i++) {
      const idx = i + 1;
      const h1 = hash31(idx);
      const st = h1[0] * (2 * Math.PI);
      const dtFactor = 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI);
      const baseScale = 5.0 + h1[1] * (10.0 - 5.0);
      const h2 = hash33(h1);
      const toggle = Math.floor(h2[0] * 2.0);
      const radiusVal = 0.5 + h2[2] * (2.0 - 0.5);
      this.ballParams.push({ st, dtFactor, baseScale, toggle, radius: radiusVal });
    }

    window.addEventListener("resize", this.resize);
    container.addEventListener("pointerenter", this.onPointerEnter);
    container.addEventListener("pointermove", this.onPointerMove);
    container.addEventListener("pointerleave", this.onPointerLeave);

    this.resize();
    this.starttime = performance.now(); // Using correct property name
    this.animationFrameId = requestAnimationFrame(this.update);
  }

  resize = () => {
    const container = this.containerRef.nativeElement;
    if (!container) return

    const width = container.clientWidth;
    const height = container.clientHeight;
    this.renderer.setSize(width, height); // Changed getSize to setSize

    this.gl.canvas.width = width;
    this.gl.canvas.height = height;

    this.gl.canvas.style.width = `${width}px`;
    this.gl.canvas.style.height = `${height}px`;
    this.program.uniforms['iResolution'].value.set( // Using bracket notation
       width,
      height,
      0
    );
  }

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.enableMouseInteraction) return;
    
    const container = this.containerRef.nativeElement;
    const rect = container.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    this.pointerX = (px / rect.width) * this.gl.canvas.width;
    this.pointerY = (1 - py / rect.height) * this.gl.canvas.height;
  }

  private onPointerEnter = (): void => {
    if (!this.enableMouseInteraction) return;
    this.pointerInside = true;
  }

  private onPointerLeave = (): void => {
    if (!this.enableMouseInteraction) return;
    this.pointerInside = false;
  }

  private update = (t: number): void => {
    this.animationFrameId = requestAnimationFrame(this.update);
    const elapsed = (t - this.starttime) * 0.001; // Using correct property name
    this.program.uniforms['iTime'].value = elapsed; // Using bracket notation
    
    const effectiveBallCount = Math.min(this.ballCount, 50);
    for (let i = 0; i < effectiveBallCount; i++) {
      const p = this.ballParams[i];
      const dt = elapsed * this.speed * p.dtFactor;
      const th = p.st + dt;
      const x = Math.cos(th);
      const y = Math.sin(th + dt * p.toggle);
      const posX = x * p.baseScale * this.clumpFactor;
      const posY = y * p.baseScale * this.clumpFactor;
      this.metaBallsUniform[i].set(posX, posY, p.radius);
    }
    
    let targetX: number, targetY: number;
    if (this.pointerInside) {
      targetX = this.pointerX;
      targetY = this.pointerY;
    } else {
      const cx = this.gl.canvas.width * 0.5;
      const cy = this.gl.canvas.height * 0.5;
      const rx = this.gl.canvas.width * 0.15;
      const ry = this.gl.canvas.height * 0.15;
      targetX = cx + Math.cos(elapsed * this.speed) * rx;
      targetY = cy + Math.sin(elapsed * this.speed) * ry;
    }
    
    this.mouseBallPops.x += (targetX - this.mouseBallPops.x) * this.hoverSmoothness; // Using correct property name
    this.mouseBallPops.y += (targetY - this.mouseBallPops.y) * this.hoverSmoothness; // Using correct property name
    this.program.uniforms['iMouse'].value.set(this.mouseBallPops.x, this.mouseBallPops.y, 0); // Using bracket notation and correct property
    
    // Define scene and camera before using them
    const scene = new Transform();
    const camera = new Camera(this.gl, {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 0.1,
      far: 10,
    });
    camera.position.z = 1;
    
    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  parseHexColor(hex: string): [number, number, number] {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0,2), 16) / 255;
    const g = parseInt(c.substring(2,4), 16) / 255;
    const b = parseInt(c.substring(4,6), 16) / 255;
    return [r, g, b];
  }
}

function hash31(p: number): number[] {
  let r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract);
  const r_yzx = [r[1], r[2], r[0]];
  const dotVal = r[0] * (r_yzx[0] + 33.33) + r[1] * (r_yzx[1] + 33.33) + r[2] * (r_yzx[2] + 33.33);
  for (let i = 0; i < 3; i++) {
    r[1] = fract(r[i] + dotVal);
  }
  return r;
}

function fract(x: number): number {
  return x - Math.floor(x);
}

function hash33(v: number[]): number[] {
  let p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract);
  const p_yxz = [p[1], p[0], p[2]];
  const dotVal =
    p[0] * (p_yxz[0] + 33.33) +
    p[1] * (p_yxz[1] + 33.33) +
    p[2] * (p_yxz[2] + 33.33);
  for (let i = 0; i < 3; i++) {
    p[i] = fract(p[i] + dotVal);
  }
  const p_xxy = [p[0], p[0], p[1]];
  const p_yxx = [p[1], p[0], p[0]];
  const p_zyx = [p[2], p[1], p[0]];
  const result: number[] = [];
  for (let i = 0; i < 3; i++) {
    result[i] = fract((p_xxy[i] + p_yxx[i]) * p_zyx[i]);
  }
  return result;
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;


const fragment = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iCursorColor;
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec3 iMetaBalls[50]; // Precomputed: xy = position, z = radius
uniform float iClumpFactor;
uniform bool enableTransparency;
out vec4 outColor;
const float PI = 3.14159265359;
 
float getMetaBallValue(vec2 c, float r, vec2 p) {
    vec2 d = p - c;
    float dist2 = dot(d, d);
    return (r * r) / dist2;
}
 
void main() {
    vec2 fc = gl_FragCoord.xy;
    float scale = iAnimationSize / iResolution.y;
    vec2 coord = (fc - iResolution.xy * 0.5) * scale;
    vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;
    float m1 = 0.0;
    for (int i = 0; i < 50; i++) {
        if (i >= iBallCount) break;
        m1 += getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, coord);
    }
    float m2 = getMetaBallValue(mouseW, iCursorBallSize, coord);
    float total = m1 + m2;
    float f = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));
    vec3 cFinal = vec3(0.0);
    if (total > 0.0) {
        float alpha1 = m1 / total;
        float alpha2 = m2 / total;
        cFinal = iColor * alpha1 + iCursorColor * alpha2;
    }
    outColor = vec4(cFinal * f, enableTransparency ? f : 1.0);
}
`;
