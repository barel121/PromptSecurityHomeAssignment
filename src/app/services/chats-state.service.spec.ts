import { TestBed } from '@angular/core/testing';

import { ChatsStateService } from './chats-state.service';

describe('ChatsStateService', () => {
  let service: ChatsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
