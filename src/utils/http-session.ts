import * as undici from "undici";
import { USER_AGENT } from "../config";
import { Logger } from "./logger-factory";
import { HeaderRecord } from "undici/types/header";

export type PartOfRequestConfig = {
  headers?: HeaderRecord;
  redirect?: undici.RequestInit["redirect"];
};

/**
 * Axiosのラッパ
 */
export class HttpSession {
  private lastUrl?: string;

  constructor(private logger: Logger, private dispatcher: undici.Dispatcher) {}

  /**
   * HTTP GET して、bodyを文字列で返す
   * @param url
   * @param config
   */
  public async getPage(
    url: string,
    config?: PartOfRequestConfig
  ): Promise<string> {
    const resp = await this.request("GET", url, config);
    const text = await resp.text();

    this.lastUrl = resp.url;

    return text;
  }

  /**
   * HTTP GET します
   *
   * @param url
   * @param config
   * @returns
   */
  public get(
    url: string,
    config?: PartOfRequestConfig
  ): Promise<undici.Response> {
    return this.request("GET", url, config);
  }

  /**
   * HTTP POST します
   *
   * @param url
   * @param body
   * @param config
   * @returns
   */
  public post(
    url: string,
    body?: undici.RequestInit["body"],
    config?: PartOfRequestConfig
  ): Promise<undici.Response> {
    return this.request("POST", url, config, body);
  }

  private async request(
    method: undici.RequestInit["method"],
    url: string,
    config: PartOfRequestConfig = {},
    body?: undici.RequestInit["body"]
  ): Promise<undici.Response> {
    config.headers = config.headers ?? {};
    config.headers["User-Agent"] = USER_AGENT;

    const init: undici.RequestInit = {
      method,
      ...config,
      dispatcher: this.dispatcher,
      referrer: this.lastUrl,
      body,
    };

    const resp = await undici.fetch(url, init);

    if (!resp.ok) {
      this.logger.error("HTTP error! status: %s, url: %s", resp.status, url);
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    return resp;
  }
}
