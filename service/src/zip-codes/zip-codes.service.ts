import { Injectable } from '@nestjs/common';
import { MongoService } from 'src/mongo-service';

/**
 * A ZipCode entry...
 * 
 * @example
 * {
 *  "_id": "36310",
 *  "city": "ABBEVILLE",
 *  "loc": [
 *    -85.279044,
 *    31.575479
 *  ],
 *  "pop": 5416,
 *  "state": "AL"
}
 */
export interface ZipCode {
  /** a zip code @example "36310" */
  _id: string;
  /** city @example "ABBEVILLE" */
  city: string;
  /** **loc**ation (geo-coordinates) @example [ -85.279044, 31.575479 ] */
  loc: number[];
  /** **pop**ulation @example 5416 */
  pop: number;
  /** two char state-code @example "AL" */
  state: string;
}

@Injectable()
export class ZipCodesService extends MongoService<ZipCode> {
  /* everything we need is inherited */
  constructor() {
    super('zips');
  }
}
