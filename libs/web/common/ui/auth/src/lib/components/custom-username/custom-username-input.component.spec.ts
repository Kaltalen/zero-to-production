import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUsernameInputComponent } from './custom-username-input.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuthFacade } from '@uqt/data-access/auth';

// TODO -> Tests
describe('CustomUsernameInputComponent', () => {
  let component: CustomUsernameInputComponent;
  let fixture: ComponentFixture<CustomUsernameInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomUsernameInputComponent],
      providers: [
        { provide: AuthFacade, useValue: { isAvailable$: jest.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomUsernameInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
