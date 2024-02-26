import { TestBed } from '@angular/core/testing';

import { RedeempointsService } from './redeempoints.service';

describe('RedeempointsService', () => {
  let service: RedeempointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedeempointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
