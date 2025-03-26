import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderItemDialogComponent } from './folder-item-dialog.component';

describe('FolderItemDialogComponent', () => {
  let component: FolderItemDialogComponent;
  let fixture: ComponentFixture<FolderItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
