import { TestBed } from '@angular/core/testing';

import { CloudserviceService } from './cloudservice.service';

describe('ModalserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudserviceService = TestBed.get(CloudserviceService);
    expect(service).toBeTruthy();
  });
});
