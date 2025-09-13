import axios from "axios";
import { USER_AGENT } from "../config";

export type PartOfRequestConfig = Pick<
  axios.AxiosRequestConfig,
  "baseURL" | "headers" | "maxRedirects"
>;

/**
 * Axiosのラッパ
 */
export class HttpSession {
  constructor(private axiosInstance: axios.AxiosInstance) {}

  /**
   * Axios get 呼びます
   *
   * @param url
   * @param config
   * @returns
   */
  public get<T = any>(
    url: string,
    config?: PartOfRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    return this.request({ ...config, method: "get", url });
  }

  /**
   * Axios get 呼びます リダイレクトに追随
   *
   * @param url
   * @param config
   * @returns
   */
  public getAndFollow<T = any>(
    url: string,
    config?: PartOfRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    return this.requestAndFollow({ ...config, method: "get", url });
  }

  /**
   * Axios post 呼びます
   * リダイレクト中の set-cookie が cookie jar に反映されない様子なので、
   * 自前でリダイレクトを追いかける
   *
   * @param url
   * @param data
   * @param config
   * @returns
   */
  public post<T = any>(
    url: string,
    data?: any,
    config?: PartOfRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    return this.request({ ...config, method: "post", url, data });
  }

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
      (url = resp.headers["Location"])
    );

    return resp;
  }

  private request<T = any>(
    config: axios.AxiosRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    return this.axiosInstance.request({
      ...config,
      headers: {
        "User-Agent": USER_AGENT,
        ...config?.headers,
      },
    });
  }
}
