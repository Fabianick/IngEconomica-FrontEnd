import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMostrarComponent } from './register-mostrar.component';

describe('RegisterMostrarComponent', () => {
  let component: RegisterMostrarComponent;
  let fixture: ComponentFixture<RegisterMostrarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterMostrarComponent]
    });
    fixture = TestBed.createComponent(RegisterMostrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
