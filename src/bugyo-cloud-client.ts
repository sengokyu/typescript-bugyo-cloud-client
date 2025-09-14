import { ClientParam } from "./models/client-param";
import { BaseTask } from "./tasks/base/base-task";
import { HttpSession } from "./utils/http-session";
import { Logger } from "./utils/logger-factory";

export class BugyoCloudClient implements ClientParam {
  private readonly _tenantCode: string;
  private readonly _session: HttpSession;
  private _userCode?: string;

  /**
   *
   */
  constructor(
    private logger: Logger,
    tenantCode: string,
    session: HttpSession
  ) {
    this._tenantCode = tenantCode;
    this._session = session;
  }

  get tenantCode(): string {
    return this._tenantCode;
  }

  get userCode(): string | undefined {
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
    this.logger.info("Executing a task: %s", task.constructor.name);
    return task.execute(this);
  }
}

export class BugyoCloudClientError extends Error {}
