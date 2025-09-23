import { CookieAgent } from "http-cookie-agent/undici";
import { CookieJar } from "tough-cookie";
import { BugyoCloudClient } from "./bugyo-cloud-client";
import { Authenticate } from "./endpoints/authenticate";
import { BaseEndpoint } from "./endpoints/base/base-endpoint";
import { CallLogout } from "./endpoints/call-logout";
import { CheckAuthenticationMethod } from "./endpoints/check-authentication-method";
import { LoginPage } from "./endpoints/login-page";
import { OmRedirect } from "./endpoints/om-redirect";
import { PunchmarkPage } from "./endpoints/punchmark-page";
import { TimeClock } from "./endpoints/time-clock";
import { AuthInfo } from "./models/auth-info";
import { PunchInfo } from "./models/punch-info";
import { BaseTask } from "./tasks/base/base-task";
import { LoginTask } from "./tasks/login-task";
import { LogoutTask } from "./tasks/logout-task";
import { PunchTask } from "./tasks/punch-task";
import { HttpSession } from "./utils/http-session";
import { Logger, LoggerFactory } from "./utils/logger-factory";

/**
 * Create instances
 */
export class BugyoCloudClientService {
  constructor(private loggerFactory: LoggerFactory) {}

  public createClient(tenantCode: string): BugyoCloudClient {
    return new BugyoCloudClient(
      this.getLogger(BugyoCloudClient),
      tenantCode,
      this.createHttpSession()
    );
  }

  public createLoginTask(authInfo: AuthInfo): BaseTask {
    return new LoginTask(
      this.getLogger(LoginTask),
      this.createEndpointInstance(LoginPage),
      this.createEndpointInstance(CheckAuthenticationMethod),
      this.createEndpointInstance(Authenticate),
      this.createEndpointInstance(OmRedirect),
      authInfo
    );
  }

  public createLogoutTask(): BaseTask {
    return new LogoutTask(
      this.getLogger(LogoutTask),
      this.createEndpointInstance(CallLogout)
    );
  }

  public createPunchTask(punchInfo: PunchInfo): BaseTask {
    return new PunchTask(
      this.getLogger(PunchTask),
      this.createEndpointInstance(TimeClock),
      this.createEndpointInstance(PunchmarkPage),
      punchInfo
    );
  }

  private createHttpSession(): HttpSession {
    const jar = new CookieJar();
    // const agent = new ProxyAgent({
    //   uri: "http://127.0.0.1:9000",
    //   // Do not verify TLS certificates.
    //   requestTls: { rejectUnauthorized: false },
    // }).compose(cookie({ jar }));

    const agent = new CookieAgent({ cookies: { jar } });

    return new HttpSession(this.getLogger(HttpSession), agent);
  }

  private createEndpointInstance<T extends BaseEndpoint>(
    ctor: (new (logger: Logger) => T) & { get name(): string }
  ): T {
    return <T>new ctor(this.loggerFactory.getLogger(ctor.name));
  }

  private getLogger(cls: { get name(): string }): Logger {
    return this.loggerFactory.getLogger(cls.name);
  }
}
