import { TestBed, inject } from '@angular/core/testing';

import { NeuronService } from './neuron.service';

describe('NeuronService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NeuronService]
    });
  });

  it('should be created', inject([NeuronService], (service: NeuronService) => {
    expect(service).toBeTruthy();
  }));
});
