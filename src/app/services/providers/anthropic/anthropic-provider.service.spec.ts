import { TestBed } from '@angular/core/testing';

import { AnthropicProviderService } from './anthropic-provider.service';

describe('AnthropicProviderService', () => {
  let service: AnthropicProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnthropicProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
