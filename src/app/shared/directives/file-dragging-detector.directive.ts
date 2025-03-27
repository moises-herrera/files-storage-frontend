import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { fromEvent, Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appFileDraggingDetector]',
})
export class FileDraggingDetectorDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  dragCounter = signal<number>(0);

  isDragging = output<boolean>();

  filesUploaded = output<FileList>();

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.onDragOver();
    this.onDragEnter();
    this.onDragLeave();
    this.onDrop();
    this.onDragEnd();
  }

  onDragOver(): void {
    fromEvent<DragEvent>(this.elementRef.nativeElement, 'dragover')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        this.isDragging.emit(true);
      });
  }

  onDragEnter(): void {
    fromEvent<DragEvent>(this.elementRef.nativeElement, 'dragenter')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        this.dragCounter.update((prev) => prev + 1);

        if (this.dragCounter() === 1) {
          this.isDragging.emit(true);
        }
      });
  }

  onDragLeave(): void {
    fromEvent<DragEvent>(this.elementRef.nativeElement, 'dragleave')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        this.dragCounter.update((prev) => prev - 1);

        if (this.dragCounter() <= 0) {
          this.isDragging.emit(false);
          this.dragCounter.set(0);
        }
      });
  }

  onDrop(): void {
    fromEvent<DragEvent>(this.elementRef.nativeElement, 'drop')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        this.dragCounter.set(0);
        this.isDragging.emit(false);

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          this.filesUploaded.emit(files);
        }
      });
  }

  onDragEnd(): void {
    fromEvent<DragEvent>(this.elementRef.nativeElement, 'dragend')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        this.dragCounter.set(0);
        this.isDragging.emit(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
