import { TestBed } from '@angular/core/testing';

import { RecentsearchService } from './recentsearch.service';

describe('RecentsearchService', () => {
  let service: RecentsearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentsearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
