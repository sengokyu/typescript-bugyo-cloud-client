import { BugyoCloudClient, Logger, LoggerFactory } from "../..";
import { TokenPage } from "../../endpoints/base/token-page";
import { BaseTask } from "./base-task";

export abstract class PostRequestTask<T> implements BaseTask {
  protected readonly logger: Logger;

  constructor(protected data: T, protected loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger(this["constructor"]["name"]);
  }

  abstract execute(client: BugyoCloudClient): Promise<void>;

  protected getPageToken<U extends TokenPage>(
    c: new (loggerFactory: LoggerFactory) => U,
    client: BugyoCloudClient
  ): Promise<string> {
    return new c(this.loggerFactory).invoke(client);
  }
}
