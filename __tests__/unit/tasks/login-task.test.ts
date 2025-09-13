import {
  mockEndpointImplementation,
  mockLoggerFactory,
} from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { Authenticate } from "../../../src/endpoints/authenticate";
import { CheckAuthenticationMethod } from "../../../src/endpoints/check-authentication-method";
import { LoginPage } from "../../../src/endpoints/login-page";
import { OmRedirect } from "../../../src/endpoints/om-redirect";
import { AuthInfo } from "../../../src/models/auth-info";
import { LoginTask } from "../../../src/tasks/login-task";
import { HttpSession } from "../../../src/utils/http-session";

jest.mock("../../../src/endpoints/login-page");
jest.mock("../../../src/endpoints/check-authentication-method");
jest.mock("../../../src/endpoints/authenticate");
jest.mock("../../../src/endpoints/om-redirect");

const mockedLoginPage = LoginPage as jest.Mock<LoginPage>;
const mockedCheckAuthenticationMethod =
  CheckAuthenticationMethod as jest.Mock<CheckAuthenticationMethod>;
const mockedAuthenticate = Authenticate as jest.Mock<Authenticate>;
const mockedOmRedirect = OmRedirect as jest.Mock<OmRedirect>;

describe("LoginTask", () => {
  const loggerFactory = mockLoggerFactory();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create instance", () => {
    // Given
    const authInfo = {} as unknown as AuthInfo;

    // When
    const instance = new LoginTask(authInfo, loggerFactory);

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
    const url = `https://example.com/${tenantCode}/${userCode}`;
    const instance = new LoginTask(authInfo, loggerFactory);
    const client = new BugyoCloudClient(tenantCode, {} as HttpSession);
    const userCodeSetter = jest.spyOn(client, "userCode", "set");

    // mockedLoginPage.mockImplementation(mockEndpoint());
    mockedCheckAuthenticationMethod.mockReturnThis();
    mockedAuthenticate.mockReturnThis();
    mockedOmRedirect.mockReturnThis();

    const loginPageInvoke = mockEndpointImplementation(mockedLoginPage);
    const checkAuthenticatedMethodInvoke = mockEndpointImplementation(
      mockedCheckAuthenticationMethod
    );
    const authenticateInvoke = mockEndpointImplementation(mockedAuthenticate);
    const omRedirectInvoke = mockEndpointImplementation(mockedOmRedirect);

    loginPageInvoke.mockResolvedValue(token);
    checkAuthenticatedMethodInvoke.mockResolvedValue(undefined);
    authenticateInvoke.mockResolvedValue(undefined);
    omRedirectInvoke.mockResolvedValue(url);

    // When
    const actualPromise = instance.execute(client);

    // Then
    await expect(actualPromise).resolves.toBeUndefined();

    // コンストラクタが呼ばれる
    expect(mockedLoginPage).toHaveBeenCalled();
    expect(mockedCheckAuthenticationMethod).toHaveBeenCalled();
    expect(mockedAuthenticate).toHaveBeenCalled();
    expect(mockedOmRedirect).toHaveBeenCalled();

    // 各invokeが呼ばれる
    expect(loginPageInvoke).toHaveBeenCalledWith(client);
    expect(checkAuthenticatedMethodInvoke).toHaveBeenCalledWith(
      client,
      token,
      authInfo
    );
    expect(authenticateInvoke).toHaveBeenCalledWith(client, token, authInfo);
    expect(omRedirectInvoke).toHaveBeenCalledWith(client);

    expect(userCodeSetter).toHaveBeenCalledWith(userCode);
  });
});
