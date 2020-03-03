import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleDynamicFormComponent } from './dynamic-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ExamplesFacade } from '@uqt/examples/data-access';
import { of } from 'rxjs';
import { DynamicFormFacade } from '@uqt/common/dynamic-form';
import { CodeHighlightService } from '@uqt/examples/utils';
import { CodeHighlightPipe } from 'libs/examples/utils/src/lib/highlight.pipe';

describe('ExampleDynamicFormComponent', () => {
  let component: ExampleDynamicFormComponent;
  let fixture: ComponentFixture<ExampleDynamicFormComponent>;
  const facadeSpy = { selectExampleById: jest.fn() };
  const dynamicFormSpy = {
    createFormIfNotExist: jest.fn(),
    formSubmits$: () => of(jest.fn())
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleDynamicFormComponent, CodeHighlightPipe],
      providers: [
        { provide: ExamplesFacade, useValue: facadeSpy },
        { provide: DynamicFormFacade, useValue: dynamicFormSpy },
        { provide: CodeHighlightService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleDynamicFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
