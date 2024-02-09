import { TestBed } from '@angular/core/testing';

import { SearchZipsService } from './search-zips.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
/**
 * If true, don't execute specs... (for contexts where we just want to import from this file)
 */
let ALREADY_RUN = false;
/**
 * For a whole hour to solve the problem, a mock like this reflects the most holiistic analysis of
 * the component.
 * 
 * **Alternative mock-points** and subsequent _"Why?"_s (or _"Why not?"_s)
 * - `zipSearch:SearchZipsService`
 *    - **Why**: allows for granular branch-testing control, isolating context
 *    - **Why not**: you have to mock more moving parts, `zips:Subject<ZipCode[]>`
 * and black-box `filterResults` and `refreshZipCodes`
 */
export class MockHttpforZipCodes {
  constructor (protected readonly presetResults:any) {}
  get (...args:any[]) {
    console.debug(args);
    return of(this.presetResults);
  }
}

ALREADY_RUN||describe('SearchZipsService', () => {
  let service: SearchZipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide:HttpClient,useValue:new MockHttpforZipCodes(mockZipCodeResults())}
      ]
    });
    service = TestBed.inject(SearchZipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

/**
 * My ideal mock looks like this:
 * 1. We definitely want to take the call to mongo's docs (any real HTTP calls) out of the test equation
 * 2. It shows that the analyzer is inspecting the underlying service
 * 3. While the unit-tests can be further reduced in variable scope, mocking the `HttpClient` allows
 * for the most comprehensive end-to-end test of `search` we want to make, while keeping the test durable.
 * 4. This mock could be re-used to further test the underlying service.
 * @returns 
 */
export function mockZipCodes() {
  return [
    {
        "_id": "01001",
        "city": "AGAWAM",
        "loc": [
            -72.622739,
            42.070206
        ],
        "pop": 15338,
        "state": "MA"
    },
    {
      "_id": "01005",
      "city": "BARRE",
      "loc": [
          -72.108354,
          42.409698
      ],
      "pop": 4546,
      "state": "MA"
    },{
      "_id": "02860",
      "city": "PAWTUCKET",
      "loc": [
          -71.390713,
          41.872873
      ],
      "pop": 45442,
      "state": "RI"
    }
  ];
}
/**
 * This mocks the form the mocked zip-codes would come in from the mongoDB docs...
 * @returns 
 */
export function mockZipCodeResults() {
  return mockZipCodes().map(o=>JSON.stringify(o)).join('\n');
}
ALREADY_RUN = true;