import { BugyoCloudClient } from "../bugyo-cloud-client";
import { Authenticate } from "../endpoints/authenticate";
import { CheckAuthenticationMethod } from "../endpoints/check-authentication-method";
import { LoginPage } from "../endpoints/login-page";
import { OmRedirect } from "../endpoints/om-redirect";
import { AuthInfo } from "../models/auth-info";
import { Logger } from "../utils/logger-factory";
import { BaseTask } from "./base/base-task";

/**
 * ログイン実行します。
 */
export class LoginTask implements BaseTask {
  constructor(
    private readonly logger: Logger,
    private readonly loginPage: LoginPage,
    private readonly checkAuthenticationMethod: CheckAuthenticationMethod,
    private readonly authenticate: Authenticate,
    private readonly omRedirect: OmRedirect,
    private readonly authInfo: AuthInfo
  ) {}

  async execute(client: BugyoCloudClient): Promise<void> {
    this.logger.trace("Invoking Loginpage.");
    const token = await this.loginPage.invoke(client);
    this.logger.debug("Got token: %s", token);

    this.logger.trace("Invoking CheckAuthenticationMethod.");
    await this.checkAuthenticationMethod.invoke(client, token, this.authInfo);

    this.logger.trace("Invoking Authenticate.");
    const redirectUrl = await this.authenticate.invoke(
      client,
      token,
      this.authInfo
    );

    this.logger.trace("Invoking OmRedirect.");
    const userCode = await this.omRedirect.invoke(client, redirectUrl);
    this.logger.debug("Got userCode: %s", userCode);

    client.userCode = userCode;
  }
}
