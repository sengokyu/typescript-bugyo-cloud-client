import { AxiosResponse } from "axios";
import { BugyoCloudClientError } from "../../bugyo-cloud-client";
import { Logger, LoggerFactory } from "../../utils/logger-factory";

export abstract class BaseEndpoint {
  protected readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger(this["constructor"]["name"]);
  }

  protected throwIfNgStatus(resp: AxiosResponse): void {
    if (resp.status !== 200) {
      const msg = `Unexpected status ${resp.status} ${resp.statusText}.`;

      this.logger.debug("Response : ", resp.data);
      this.logger.error(msg);

      throw new BugyoCloudClientError(msg);
    }
  }
}
