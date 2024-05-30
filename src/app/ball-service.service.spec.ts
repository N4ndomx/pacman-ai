import { TestBed } from '@angular/core/testing';

import { BallServiceService } from './services/ball-service.service';

describe('BallServiceService', () => {
  let service: BallServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BallServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
