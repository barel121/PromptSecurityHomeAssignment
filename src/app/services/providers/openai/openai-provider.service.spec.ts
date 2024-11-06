import { TestBed } from '@angular/core/testing';

import { OpenaiProviderService } from '../openai/openai-provider.service';

describe('OpenaiProviderService', () => {
  let service: OpenaiProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenaiProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
