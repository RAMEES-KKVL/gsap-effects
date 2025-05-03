import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface WindowShape {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowData {
  id: number;
  shape: WindowShape;
  metaData: any;
}

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  private windows: WindowData[] = [];
  private count: number = 0;
  private id: number = 0;
  private winData: WindowData | null = null;

  private windowsSubject = new BehaviorSubject<WindowData[]>([]);
  public windows$ = this.windowsSubject.asObservable();

  private windowShapeChangeCallback: (() => void) | null = null;
  private winChangeCallback: (() => void) | null = null;

  constructor() {
    // Event listener for when localStorage is changed from another window
    window.addEventListener("storage", (event) => {
      if (event.key === "windows") {
        const newWindows = JSON.parse(event.newValue || '[]');
        const winChange = this.didWindowsChange(this.windows, newWindows);
        this.windows = newWindows;
        this.windowsSubject.next(this.windows);
        
        if (winChange && this.winChangeCallback) {
          this.winChangeCallback();
        }
      }
    });

    // Event listener for when current window is about to be closed
    window.addEventListener('beforeunload', () => {
      if (this.id) {
        const index = this.getWindowIndexFromId(this.id);
        if (index !== -1) {
          this.windows.splice(index, 1);
          this.updateWindowsLocalStorage();
        }
      }
    });
  }

  // Check if there's any changes to the window list
  private didWindowsChange(prevWindows: WindowData[], newWindows: WindowData[]): boolean {
    if (prevWindows.length !== newWindows.length) {
      return true;
    } else {
      for (let i = 0; i < prevWindows.length; i++) {  
        if (prevWindows[i].id !== newWindows[i].id) {
          return true;
        }
      }
      return false;
    }
  }

  // Initialize current window
  init(metaData: any): void {
    this.windows = JSON.parse(localStorage.getItem("windows") || '[]');
    this.count = parseInt(localStorage.getItem("count") || '0', 10);
    this.count++;
    this.id = this.count;
    
    const shape = this.getWinShape();
    this.winData = { id: this.id, shape: shape, metaData: metaData };
    this.windows.push(this.winData);
    
    localStorage.setItem("count", this.count.toString());
    this.updateWindowsLocalStorage();
    this.windowsSubject.next(this.windows);
  }

  getWinShape(): WindowShape {
    return {
      x: window.screenLeft, 
      y: window.screenTop, 
      w: window.innerWidth, 
      h: window.innerHeight
    };
  }

  getWindowIndexFromId(id: number): number {
    let index = -1;
    for (let i = 0; i < this.windows.length; i++) {
      if (this.windows[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  updateWindowsLocalStorage(): void {
    localStorage.setItem("windows", JSON.stringify(this.windows));
  }

  update(): void {
    if (!this.winData) return;
    
    const winShape = this.getWinShape();
    if (
      winShape.x !== this.winData.shape.x ||
      winShape.y !== this.winData.shape.y ||
      winShape.w !== this.winData.shape.w ||
      winShape.h !== this.winData.shape.h
    ) {
      this.winData.shape = winShape;
      const index = this.getWindowIndexFromId(this.id);
      if (index !== -1) {
        this.windows[index].shape = winShape;
        
        if (this.windowShapeChangeCallback) {
          this.windowShapeChangeCallback();
        }
        
        this.updateWindowsLocalStorage();
        this.windowsSubject.next(this.windows);
      }
    }
  }

  setWinShapeChangeCallback(callback: () => void): void {
    this.windowShapeChangeCallback = callback;
  }

  setWinChangeCallback(callback: () => void): void {
    this.winChangeCallback = callback;
  }

  getWindows(): WindowData[] {
    return this.windows;
  }

  getThisWindowData(): WindowData | null {
    return this.winData;
  }

  getThisWindowID(): number {
    return this.id;
  }
}