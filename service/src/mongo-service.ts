
export const MONGO_URI = process.env.MONGO_URI || `mongodb://127.0.0.1:27017`;
export const MONGO_DB = 'test';
/* eslint-disable prettier/prettier */
import { Collection, MongoClient, Db, Filter } from 'mongodb';
export abstract class MongoService<T> {
  /** Cache `T` objects as they come back from results */
  protected cache = new Map<string, T[]>();
  protected collection?: Collection<T>;

  constructor(
    protected readonly defaultCollection: string,
    protected client?: MongoClient,
    protected db?: Db
  ) {}

  /**
   * Initialize a mongo service:
   * - Connect to the database server `MONGO_URI`
   * - Set a database `MONGO_DB`
   * - Set a default collection `defaultCollection`
   *
   * @returns a `Promise` of this service when in a connected state
   */
  async init() {
    const notConnected = !this.client;
    this.client = this.client || new MongoClient(MONGO_URI);
    if (notConnected) {
      this.client = await this.client.connect();
    }
    this.db = this.client.db(MONGO_DB);
    this.collection = this.db.collection(this.defaultCollection);
    return this;
  }

  /**
   * Access an external collection other than the "default"
   *
   * @example this.intialize().in("another-collection")
   */
  async in<T2>(name: string) {
    const externalCollectionService = new AnyMongoService<T2>(
      name,
      this.client,
      this.db,
    );
    return externalCollectionService.init();
  }

  /** Search for things, cache results */
  async search(filter: Filter<T>, cached = true) {
    const cachedSearch = JSON.stringify(filter);
    let cachedResults = this.cache.get(cachedSearch);
    // const cachedResults = await this.cacheService.get(cachedSearch)
    if (cached && cachedResults) {
      return cachedResults;
    }
    cachedResults = [];
    this.cache.set(cachedSearch, cachedResults);
    (await (await this.init()).collection.find(filter).toArray()).map(
      (item) => {
        cachedResults.push(item as any);
        return item as any;
      },
    );
    return cachedResults;
  }

  /**
   * Find documents near a geo-point
   * https://www.mongodb.com/docs/manual/geospatial-queries/
   * https://www.mongodb.com/docs/manual/reference/operator/query/near/#mongodb-query-op.-near
   *
   * @param withinXMetersOf
   * @param coordinates
   * @param filter
   * @param locationField
   * @param atLeastXMetersFrom
   * @returns
   */
  async near(
    withinXMetersOf: number,
    [longitude, latitude]: number[],
    filter: Filter<T>,
    locationField = 'location',
    atLeastXMetersFrom = 0,
  ) {
    if (withinXMetersOf && longitude && latitude) {
      const geoFilter = {
        ...filter,
        [locationField]: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            /** distance in meters */
            $maxDistance: withinXMetersOf,
            $minDistance: atLeastXMetersFrom,
          },
        },
      };
      return this.search(geoFilter);
    }
    return this.search(filter);
  }
}
export class AnyMongoService<T> extends MongoService<T> {}
