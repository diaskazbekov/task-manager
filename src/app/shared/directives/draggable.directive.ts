import { Directive, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { fromEvent, Subscription } from "rxjs";
import { Position } from "../classes/position";

@Directive({
  selector: '[appDraggable]',
  standalone: true
})
export class DraggableDirective implements OnDestroy, OnInit {
  @Output() stopped: EventEmitter<any> = new EventEmitter<any>();
  private handle: HTMLElement | null | undefined;
  private draggingSub: Subscription | null = null;
  private moving: boolean = false;
  private original: Position | null = null;
  private transition: Position | null = new Position(0, 0);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.handle = this.el.nativeElement.querySelector('.handle');
  }

  private getDragEl() {
    return this.handle ? this.handle : this.el.nativeElement;
  }

  private moveTo(p: Position): void {
    if (this.original) {
      p.subtract(this.original);
      this.transition!.set(p);
      this.transform();
    }
  }

  private transform(): void {
    let value: string = `translate(${Math.round(this.transition!.x)}px, ${Math.round(this.transition!.y)}px)`;

    this.renderer.setStyle(this.el.nativeElement, 'transform', value);
    this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', value);
    this.renderer.setStyle(this.el.nativeElement, '-ms-transform', value);
    this.renderer.setStyle(this.el.nativeElement, '-moz-transform', value);
    this.renderer.setStyle(this.el.nativeElement, '-o-transform', value);
  }

  private pickUp(): void {
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '9999');

    if (!this.moving) {
      this.moving = true;

      this.subscribeEvents();
    }
  }

  private subscribeEvents(): void {
    this.draggingSub = fromEvent(document, 'mousemove', { passive: false }).subscribe((event: Event) => this.onMouseMove(event as MouseEvent));
    this.draggingSub.add(
      fromEvent(document, 'touchmove', { passive: false }).subscribe((event: Event) => this.onMouseMove(event as TouchEvent))
    );
    this.draggingSub.add(
      fromEvent(document, 'mouseup', { passive: false }).subscribe(() => this.putBack())
    );

    let isIEOrEdge: boolean = /msie\s|trident\//i.test(window.navigator.userAgent);
    if (!isIEOrEdge) {
      this.draggingSub.add(
        fromEvent(document, 'mouseleave', { passive: false }).subscribe(() => this.putBack())
      );
    }
    this.draggingSub.add(
      fromEvent(document, 'touchend', { passive: false }).subscribe(() => this.putBack())
    );
    this.draggingSub.add(
      fromEvent(document, 'touchcancel', { passive: false }).subscribe(() => this.putBack())
    );
  }

  private unsubscribeEvents(): void {
    this.draggingSub!.unsubscribe();
    this.draggingSub = null;
  }

  private putBack(): void {
    this.el.nativeElement.style.removeProperty('z-index');

    if (this.moving) {
      this.stopped.emit(this.el.nativeElement);

      this.moving = false;

      this.transition!.reset();

      this.transform();

      this.unsubscribeEvents();
    }
  }

  checkHandleTarget(target: EventTarget, element: Element): boolean {
    if (element === target) {
      return true;
    }

    for (let child in element.children) {
      if (element.children.hasOwnProperty(child)) {
        if (this.checkHandleTarget(target, element.children[child])) {
          return true;
        }
      }
    }

    return false;
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent): void {
    if (event instanceof MouseEvent && event.button === 2) {
      return;
    }

    if (this.handle !== undefined && !this.checkHandleTarget(event.target!, this.handle!)) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    this.original = Position.fromEvent(event, this.getDragEl());
    this.pickUp();
  }

  onMouseMove(event: MouseEvent | TouchEvent): void {
    if (this.moving) {
      event.stopPropagation();
      event.preventDefault();
      this.moveTo(Position.fromEvent(event, this.getDragEl())!);
    }
  }

  ngOnDestroy(): void {
    this.handle = null;
    this.original = null;
    this.transition = null;

    if (this.draggingSub) {
      this.draggingSub.unsubscribe();
    }
  }
}
