import { AxiosHeaders, AxiosRequestConfig } from "axios";
import { BugyoCloudClient } from "..";
import { EndpointName } from "../config";
import { produceUrl } from "../utils/url-utils";
import { BaseEndpoint } from "./base/base-endpoint";

/**
 * 申請します。
 */
export class WorkflowApply extends BaseEndpoint {
  async invoke<T>(
    client: BugyoCloudClient,
    data: T,
    args: Readonly<{
      token: string;
      refererEndpointName: EndpointName;
    }>
  ): Promise<void> {
    const url = produceUrl("WorkflowApply", client.param);
    const headers = new AxiosHeaders();
    headers.set("Referer", produceUrl(args.refererEndpointName, client.param));
    headers.set("X-Requested-With", "XMLHttpRequest");
    headers.set("__RequestVerificationToken", args.token);
    const config: AxiosRequestConfig = { headers, maxRedirects: 0 };

    this.logger.debug("Trying to POST, url=%s", url, data, config);

    const resp = await client.session.post(url, data, config);

    this.throwIfNgStatus(resp);

    this.logger.info("Wokflow apply succeed.");
  }
}
