import { TestBed } from '@angular/core/testing';

import { CommonActivityService } from './common-activity.service';

describe('CommonActivityService', () => {
  let service: CommonActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
