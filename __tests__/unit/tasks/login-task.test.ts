import {
  mockEndpointImplementation,
  mockLogger,
} from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { Authenticate } from "../../../src/endpoints/authenticate";
import { CheckAuthenticationMethod } from "../../../src/endpoints/check-authentication-method";
import { LoginPage } from "../../../src/endpoints/login-page";
import { OmRedirect } from "../../../src/endpoints/om-redirect";
import { AuthInfo } from "../../../src/models/auth-info";
import { LoginTask } from "../../../src/tasks/login-task";
import { HttpSession } from "../../../src/utils/http-session";
import { Logger } from "../../../dist/utils/logger-factory";

describe("LoginTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create instance", () => {
    // Given
    const authInfo = {} as unknown as AuthInfo;

    // When
    const instance = new LoginTask(
      mockLogger(),
      mockEndpointImplementation<LoginPage>(),
      mockEndpointImplementation<CheckAuthenticationMethod>(),
      mockEndpointImplementation<Authenticate>(),
      mockEndpointImplementation<OmRedirect>(),
      authInfo
    );

    // Then
    expect(instance).toBeInstanceOf(LoginTask);
  });

  it("ログイン実行します", async () => {
    // Given
    const loginId = "login";
    const password = "password";
    const authInfo: AuthInfo = { loginId, password };
    const tenantCode = "ttttt";
    const token = "login page token";
    const userCode = "uuuuu";
    const loginPage = mockEndpointImplementation<LoginPage>();
    const checkAuthenticatedMethod =
      mockEndpointImplementation<CheckAuthenticationMethod>();
    const authenticate = mockEndpointImplementation<Authenticate>();
    const omRedirect = mockEndpointImplementation<OmRedirect>();
    const instance = new LoginTask(
      mockLogger(),
      loginPage,
      checkAuthenticatedMethod,
      authenticate,
      omRedirect,
      authInfo
    );
    const client = new BugyoCloudClient(
      {} as Logger,
      tenantCode,
      {} as HttpSession
    );
    const userCodeSetter = jest.spyOn(client, "userCode", "set");

    loginPage.invoke.mockResolvedValue(token);
    checkAuthenticatedMethod.invoke.mockResolvedValue(undefined);
    authenticate.invoke.mockResolvedValue(undefined);
    omRedirect.invoke.mockResolvedValue(userCode);

    // When
    const actualPromise = instance.execute(client);

    // Then
    await expect(actualPromise).resolves.toBeUndefined();

    // 各invokeが呼ばれる
    expect(loginPage.invoke).toHaveBeenCalledWith(client);
    expect(checkAuthenticatedMethod.invoke).toHaveBeenCalledWith(
      client,
      token,
      authInfo
    );
    expect(authenticate.invoke).toHaveBeenCalledWith(client, token, authInfo);
    expect(omRedirect.invoke).toHaveBeenCalledWith(client);

    expect(userCodeSetter).toHaveBeenCalledWith(userCode);
  });
});
