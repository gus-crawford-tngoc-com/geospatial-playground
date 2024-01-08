import { Collection, MongoClient, Db, Filter } from 'mongodb';
export abstract class MongoService<T> {
  /** Cache `T` objects as they come back from results */
  protected cache = new Map<string, T>();
  protected collection?: Collection<T>;

  constructor(
    protected readonly defaultCollection: string,
    protected client?: MongoClient,
    protected db?: Db,
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
    this.client = this.client || new MongoClient(process.env.MONGO_URI);
    if (notConnected) {
      this.client = await this.client.connect();
    }
    this.db = this.client.db(process.env.MONGO_DB);
    this.collection = this.db.collection(this.defaultCollection);
    return this;
  }

  /**
   * Access an external collection other than the "default"
   */
  async in<T2>(name: string) {
    return (await this.init()).db.collection<T2>(name);
  }

  /** Search for things, cache results */
  async search(filter: Filter<T>) {
    (await (await this.init()).collection.find(filter).toArray()).map(
        item=>{
            this.cache.set(item._id.toString(), item);
            return item;
        }
    )
  }

  async spatially([longitude:number, latitude:number], filter:Filter<T>, locationField='location') {
    const x = {
        [locationField]: {
          $near: {
            $geometry: {
               type: "Point" ,
               coordinates: [ <longitude> , <latitude> ]
            },
            $maxDistance: <distance in meters>,
            $minDistance: <distance in meters>
          }
        }
     }
  }
}
