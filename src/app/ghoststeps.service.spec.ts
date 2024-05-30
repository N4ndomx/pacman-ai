import { TestBed } from '@angular/core/testing';

import { GhoststepsService } from './services/ghoststeps.service';

describe('GhoststepsService', () => {
  let service: GhoststepsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GhoststepsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
