import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})

export class SearchZipsService {

  constructor(
    protected readonly http: HttpClient
  ) { }

    /**
@example
[
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
]
  */
  public zips = new Subject<ZipCode[]>;
  public loading?: Promise<ZipCode[]>;
  filterResults(zips:ZipCode[], exp: string, state:string) {
    return zips.filter(
      zip=>this.possbibleStateMatch(zip.state, state) && (
        this.fieldMatches(zip._id, exp) || this.fieldMatches(zip.city, exp)
      )
    );
  }
  /**
   * Make an HTTP call for zip codes...
   * 
   * - Returns **plain/text** mime
   * - (a streamable I suppose) `\n` separated JSON-format of zip codes (as would load into a mongodb)
   */
  refreshZipCodes(
    /** search expresssion */
    exp:string
  ) {
    if (this.loading) {
      return this.loading;
    }
    return this.loading = this.http.get(`/api/zips?text=${exp}`).toPromise().then(
      zipCodes=>{
        const results:ZipCode[] = zipCodes as any;
        this.loading = undefined;
        this.zips.next(results);
      }
    ).catch(err=>{
      console.debug(err);
      this.zips.error(err);
      return undefined;
    }) as any;
  }

  /**
   * Does `field` contain `subject` (case-insensitive)?
   * @param field The value of a field
   * @param subject A subject to check for in the field
   * @returns `boolean`
   */
  protected fieldMatches(field:string, subject:string) {
    if (!subject) {
      return true;
    }
    return field.toLocaleLowerCase().indexOf(subject.toLocaleLowerCase()) !== -1
  }
  /**
   * Did things get filtered down to a state?
   * @param code The state code of a ZIP entry
   * @param subject A fully written state name
   * @returns `true` for a `code` where the first letter and the `subject`'s match, and the second letter exists in the subject
   */
  protected possbibleStateMatch(code:string, subject:string) {
    if (!subject) {
      return true;
    }
    return subject.toLocaleLowerCase().startsWith(code.toLocaleLowerCase().charAt(0)) && this.fieldMatches(subject, code.toLocaleLowerCase().charAt(1));
  }
}
