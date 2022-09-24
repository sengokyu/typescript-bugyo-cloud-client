import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { wrapper } from "axios-cookiejar-support";
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
      jar: new CookieJar(),
    };
    const instance = wrapper(axios.create(config));

    return instance;
  }
}

export class BugyoCloudClientError extends Error {}
