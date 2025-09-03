import { BugyoCloudClient } from "../bugyo-cloud-client";
import { Authenticate } from "../endpoints/authenticate";
import { CheckAuthenticationMethod } from "../endpoints/check-authentication-method";
import { LoginPage } from "../endpoints/login-page";
import { OmRedirect } from "../endpoints/om-redirect";
import { AuthInfo } from "../models/auth-info";
import { Logger, LoggerFactory } from "../utils/logger-factory";
import { extractUserCode } from "../utils/url-utils";
import { BaseTask } from "./base/base-task";

/**
 * ログイン実行します。
 */
export class LoginTask implements BaseTask {
  private readonly logger: Logger;

  constructor(
    private authInfo: AuthInfo,
    private loggerFactory: LoggerFactory
  ) {
    this.logger = loggerFactory.getLogger(LoginTask.name);
  }

  async execute(client: BugyoCloudClient): Promise<void> {
    const loginPage = new LoginPage(this.loggerFactory);
    const checkAuthenticationMethod = new CheckAuthenticationMethod(
      this.loggerFactory
    );
    const authenticate = new Authenticate(this.loggerFactory);
    const omRedirect = new OmRedirect(this.loggerFactory);

    this.logger.trace("Trying to get the login page token.");
    const token = await loginPage.invoke(client);

    this.logger.trace("Trying to check authentication method.");
    await checkAuthenticationMethod.invoke(client, token, this.authInfo);

    this.logger.trace("Trying to authenticate.");
    await authenticate.invoke(client, token, this.authInfo);

    this.logger.trace("Trying to get the redirect url.");
    const url = await omRedirect.invoke(client);

    client.userCode = extractUserCode(url);
  }
}
