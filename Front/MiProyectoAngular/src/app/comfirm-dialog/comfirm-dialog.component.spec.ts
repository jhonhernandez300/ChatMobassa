import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmDialogComponent } from './comfirm-dialog.component';

describe('ComfirmDialogComponent', () => {
  let component: ComfirmDialogComponent;
  let fixture: ComponentFixture<ComfirmDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComfirmDialogComponent]
    });
    fixture = TestBed.createComponent(ComfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
