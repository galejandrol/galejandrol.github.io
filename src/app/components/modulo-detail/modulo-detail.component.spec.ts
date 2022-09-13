import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloDetailComponent } from './modulo-detail.component';

describe('ModuloDetailComponent', () => {
  let component: ModuloDetailComponent;
  let fixture: ComponentFixture<ModuloDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
