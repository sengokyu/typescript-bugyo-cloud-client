import axios, { AxiosInstance } from "axios";
import { HttpCookieAgent, HttpsCookieAgent } from "http-cookie-agent/http";
import { CookieJar } from "tough-cookie";
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
    const jar = new CookieJar();

    return axios.create({
      httpAgent: new HttpCookieAgent({ cookies: { jar } }),
      httpsAgent: new HttpsCookieAgent({ cookies: { jar } }),
    });
  }
}

export class BugyoCloudClientError extends Error {}
