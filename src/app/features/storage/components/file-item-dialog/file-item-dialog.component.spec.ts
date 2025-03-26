import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileItemDialogComponent } from './file-item-dialog.component';

describe('FileItemDialogComponent', () => {
  let component: FileItemDialogComponent;
  let fixture: ComponentFixture<FileItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
