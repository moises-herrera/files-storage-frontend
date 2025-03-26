import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageTableComponent } from './storage-table.component';

describe('StorageTableComponent', () => {
  let component: StorageTableComponent;
  let fixture: ComponentFixture<StorageTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
