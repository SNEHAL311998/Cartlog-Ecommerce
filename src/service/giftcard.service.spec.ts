import { TestBed } from '@angular/core/testing';

import { GiftcardService } from './giftcard.service';

describe('GiftcardService', () => {
  let service: GiftcardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiftcardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
