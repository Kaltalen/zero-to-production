import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { CommonUiSideNavComponent } from './side-nav.component';
import { SideNavFacade } from './+state/side-nav.facade';

// TODO -> TESTS

describe('CommonUiSideNavComponent', () => {
  let component: CommonUiSideNavComponent;
  let fixture: ComponentFixture<CommonUiSideNavComponent>;
  let debugEl: DebugElement;
  let nativeEl: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonUiSideNavComponent],
      providers: [
        {
          provide: SideNavFacade,
          useValue: { opened$: jest.fn(), route$: jest.fn() }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonUiSideNavComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    nativeEl = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
