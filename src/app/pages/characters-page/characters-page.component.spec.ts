import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionPageComponent } from './characters-page.component';

describe('InstructionPageComponent', () => {
  let component: InstructionPageComponent;
  let fixture: ComponentFixture<InstructionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
