import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldersGridComponent } from './folders-grid.component';

describe('FoldersGridComponent', () => {
  let component: FoldersGridComponent;
  let fixture: ComponentFixture<FoldersGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoldersGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoldersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
