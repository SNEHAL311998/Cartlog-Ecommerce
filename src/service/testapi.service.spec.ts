import { TestBed } from '@angular/core/testing';

import { TestapiService } from './testapi.service';

describe('TestapiService', () => {
  let service: TestapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
