import { ClientParam } from "./models/client-param";
import { BaseTask } from "./tasks/base/base-task";
import { HttpSession } from "./utils/http-session";

export class BugyoCloudClient implements ClientParam {
  private readonly _tenantCode: string;
  private readonly _session: HttpSession;
  private _userCode: string | null = null;

  /**
   *
   */
  constructor(tenantCode: string) {
    this._tenantCode = tenantCode;
    this._session = new HttpSession();
  }

  get tenantCode(): string {
    return this._tenantCode;
  }

  get userCode(): string | null {
    return this._userCode;
  }

  set userCode(value: string) {
    this._userCode = value;
  }

  get session(): HttpSession {
    return this._session;
  }

  /**
   * タスクを実行します。
   * @param task タスク
   */
  public doA(task: BaseTask): Promise<void> {
    return task.execute(this);
  }
}

export class BugyoCloudClientError extends Error {}
