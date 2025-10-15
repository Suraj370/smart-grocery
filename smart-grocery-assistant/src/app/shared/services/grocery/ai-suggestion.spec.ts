import { TestBed } from '@angular/core/testing';

import { AiSuggestion } from './ai-suggestion';

describe('AiSuggestion', () => {
  let service: AiSuggestion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiSuggestion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
