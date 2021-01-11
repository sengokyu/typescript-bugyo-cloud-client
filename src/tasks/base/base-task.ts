import { BugyoCloudClient } from "../../bugyo-cloud-client";

export interface BaseTask {
  execute(client: BugyoCloudClient): Promise<void>;
}
