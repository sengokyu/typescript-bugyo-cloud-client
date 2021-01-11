import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { USER_AGENT } from "./config";
import { ClientParam } from "./models/client-param";
import { BaseTask } from "./tasks/base/base-task";

export class BugyoCloudClient {
  private readonly _param: ClientParam;
  private readonly _session: AxiosInstance;

  /**
   *
   */
  constructor(tenantCode: string) {
    this._param = { tenantCode };
    this._session = this.createSession();
  }

  get param(): ClientParam {
    return this._param;
  }

  get session(): AxiosInstance {
    return this._session;
  }

  /**
   * タスクを実行します。
   * @param task タスク
   */
  public doA(task: BaseTask): Promise<void> {
    return task.execute(this);
  }

  private createSession(): AxiosInstance {
    const config: AxiosRequestConfig = {
      headers: { "User-Agent": USER_AGENT },
      withCredentials: true,
    };
    const instance = axios.create(config);

    axiosCookieJarSupport(instance);

    // via: https://www.npmjs.com/package/axios-cookiejar-support
    // axios@>=0.19.0 cannot assign defaults.jar via axios.create()
    // before wrapping instance. 
    instance.defaults.jar = new CookieJar();

    return instance;
  }
}

export class BugyoCloudClientError extends Error {}
