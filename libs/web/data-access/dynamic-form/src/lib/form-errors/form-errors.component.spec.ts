import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormErrorsComponent } from './form-errors.component';
import { DynamicFormFacade } from '../+state/dynamic-form.facade';
import { FormErrorPipe } from './form-error.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FormErrorsComponent', () => {
  let component: FormErrorsComponent;
  let fixture: ComponentFixture<FormErrorsComponent>;
  let facade: DynamicFormFacade;

  const facadeSpy = {
    errors$: of(jest.fn())
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormErrorsComponent, FormErrorPipe],
      providers: [{ provide: DynamicFormFacade, useValue: facadeSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    facade = TestBed.get<DynamicFormFacade>(DynamicFormFacade);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
