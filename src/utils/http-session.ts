import axios from "axios";
import { HttpCookieAgent, HttpsCookieAgent } from "http-cookie-agent/http";
import { CookieJar } from "tough-cookie";

const DEFAULT_REQUEST_CONFIG: axios.AxiosRequestConfig = {
  // リダイレクトは自前で処理
  maxRedirects: 0,
  // 302のときに、エラーにならないようにする
  validateStatus: (status) => (status >= 200 && status < 300) || status === 302,
};

/**
 * Axiosのラッパ
 */
export class HttpSession {
  private readonly session: axios.AxiosInstance;

  constructor() {
    this.session = this.createSession();
  }

  /**
   * Axios get 呼びます
   *
   * @param url
   * @param config
   * @returns
   */
  public get<T = any>(
    url: string,
    config?: axios.AxiosRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    return this.request({ method: "get", url, ...config });
  }

  /**
   * Axios post 呼びます
   *
   * @param url
   * @param data
   * @param config
   * @returns
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: axios.AxiosRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    return this.request({ method: "post", url, data, ...config });
  }

  public async request<T = any>(
    config: axios.AxiosRequestConfig
  ): Promise<axios.AxiosResponse<T>> {
    let resp: axios.AxiosResponse<T>;
    let nextUrl = config.url;
    const actualConfig = { ...DEFAULT_REQUEST_CONFIG, config };

    // リダイレクト中の set-cookie が動かない様子なので、
    // 自前でリダイレクトを追いかける
    do {
      actualConfig.url = nextUrl;
      resp = await this.session.request(actualConfig);
    } while (resp.status === 302 && (nextUrl = resp.headers["location"]));

    return resp;
  }

  private createSession(): axios.AxiosInstance {
    const jar = new CookieJar();

    return axios.create({
      httpAgent: new HttpCookieAgent({ cookies: { jar } }),
      httpsAgent: new HttpsCookieAgent({ cookies: { jar } }),
    });
  }
}
