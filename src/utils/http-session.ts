import axios from "axios";
import { USER_AGENT } from "../config";
import { Logger } from "./logger-factory";
import { PrettyUrl } from "../models/pretty-url";

export type PartOfRequestConfig = Pick<
  axios.AxiosRequestConfig,
  "baseURL" | "headers" | "maxRedirects"
>;

/**
 * Axiosのラッパ
 */
export class HttpSession {
  private lastUrl?: string;

  constructor(
    private logger: Logger,
    private axiosInstance: axios.AxiosInstance
  ) {}

  /**
   * Axios get 呼びます
   *
   * @param url
   * @param config
   * @returns
   */
  public async get<T = any>(
    url: PrettyUrl,
    config?: PartOfRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    const resp = await this.request({
      ...config,
      method: "get",
      url: url.absoluteURL,
      baseURL: url.baseURL,
    });

    this.lastUrl = resp.config?.url;

    return resp;
  }

  /**
   * Axios get 呼びます リダイレクトに追随
   *
   * @param url
   * @param config
   * @returns
   */
  public async getAndFollow<T = any>(
    url: PrettyUrl,
    config?: PartOfRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    const resp = await this.requestAndFollow({
      ...config,
      method: "get",
      url: url.absoluteURL,
      baseURL: url.baseURL,
    });

    this.lastUrl = resp.config?.url;

    return resp;
  }

  /**
   * Axios post 呼びます
   *
   * @param url
   * @param data
   * @param config
   * @returns
   */
  public post<T = any>(
    url: PrettyUrl,
    data?: any,
    config?: PartOfRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    const newconfig = {
      ...config,
      method: "post",
      url: url.absoluteURL,
      baseURL: url.baseURL,
      data,
    };

    if (this.lastUrl) {
      newconfig.headers ??= {};
      newconfig.headers.Referer = this.lastUrl;
    }

    return this.request(newconfig);
  }

  /**
   * Axios 呼び出す
   *
   * リダイレクト中の set-cookie が cookie jar に反映されない様子なので、
   * 自前でリダイレクトを追いかける
   *
   * @param config
   * @returns
   */
  private async requestAndFollow<T = any>(
    config: axios.AxiosRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    let resp: axios.AxiosResponse<T>;
    // For avoiding infinite loop
    let redirectionCount = 5;
    let url = config.url;

    const maxRedirects = 0;
    // 302のときに、エラーにならないようにする
    const validateStatus: axios.AxiosRequestConfig["validateStatus"] = (
      status
    ) => (status >= 200 && status < 300) || status === 302;

    do {
      resp = await this.request({
        ...config,
        url,
        maxRedirects,
        validateStatus,
      });
    } while (
      --redirectionCount > 0 &&
      resp.status === 302 &&
      (url = resp.headers["location"])
    );

    return resp;
  }

  private async request<T = any>(
    config: axios.AxiosRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    const newconfig = {
      ...config,
      headers: {
        "User-Agent": USER_AGENT,
        ...config?.headers,
      },
    };

    this.logger.debug("Method: %s", newconfig.method);
    this.logger.debug("URL: %s", newconfig.url);
    this.logger.debug("Headers: %s", newconfig.headers);

    const resp = await this.axiosInstance.request(newconfig);

    this.logger.debug("Status: %s", resp.status);

    return resp;
  }
}
