import { BugyoCloudClient } from "../bugyo-cloud-client";
import { Authenticate } from "../endpoints/authenticate";
import { CheckAuthenticationMethod } from "../endpoints/check-authentication-method";
import { LoginPage } from "../endpoints/login-page";
import { TopPage } from "../endpoints/top-page";
import { AuthInfo } from "../models/auth-info";
import { LoggerFactory } from "../utils/logger-factory";
import { BaseTask } from "./base/base-task";

/**
 * ログイン実行します。
 */
export class LoginTask implements BaseTask {
  private readonly logger = LoggerFactory.getLogger(LoginTask.name);

  constructor(private authInfo: AuthInfo) {}

  async execute(client: BugyoCloudClient): Promise<void> {
    this.logger.trace("Trying to get the login page token.");
    const token = await this.getLoginPageToken(client);
    await this.checkAuthMethod(client, token);

    this.logger.trace("Trying to get the redirect url.");
    const url = await this.authenticate(client, token);
    await this.setupUserCode(client, url);
  }

  private getLoginPageToken(client: BugyoCloudClient): Promise<string> {
    return new LoginPage().invoke(client);
  }

  private checkAuthMethod(
    client: BugyoCloudClient,
    token: string
  ): Promise<void> {
    return new CheckAuthenticationMethod().invoke(client, token, this.authInfo);
  }

  private authenticate(
    client: BugyoCloudClient,
    token: string
  ): Promise<string> {
    return new Authenticate().invoke(client, token, this.authInfo);
  }

  private async setupUserCode(
    client: BugyoCloudClient,
    url: string
  ): Promise<void> {
    const topPage = new TopPage();
    const userCode = await topPage.invoke(client, url);

    this.logger.debug("UserCode retrieved.", userCode);

    client.param.userCode = userCode;
  }
}
