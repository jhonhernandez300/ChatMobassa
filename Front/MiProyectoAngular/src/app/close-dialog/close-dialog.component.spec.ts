import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseDialogComponent } from './close-dialog.component';

describe('CloseDialogComponent', () => {
  let component: CloseDialogComponent;
  let fixture: ComponentFixture<CloseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CloseDialogComponent]
    });
    fixture = TestBed.createComponent(CloseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
