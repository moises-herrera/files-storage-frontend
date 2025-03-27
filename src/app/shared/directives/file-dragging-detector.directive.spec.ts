import { ElementRef } from '@angular/core';
import { FileDraggingDetectorDirective } from './file-dragging-detector.directive';

describe('appFileDraggingDetector', () => {
  it('should create an instance', () => {
    const directive = new FileDraggingDetectorDirective(
      {} as unknown as ElementRef<HTMLElement>
    );
    expect(directive).toBeTruthy();
  });
});
