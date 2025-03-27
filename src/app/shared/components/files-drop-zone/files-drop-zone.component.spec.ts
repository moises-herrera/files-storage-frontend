import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesDropZoneComponent } from './files-drop-zone.component';

describe('FilesDropZoneComponent', () => {
  let component: FilesDropZoneComponent;
  let fixture: ComponentFixture<FilesDropZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesDropZoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesDropZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
