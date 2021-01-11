import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { Authenticate } from "../../../src/endpoints/authenticate";
import { CheckAuthenticationMethod } from "../../../src/endpoints/check-authentication-method";
import { LoginPage } from "../../../src/endpoints/login-page";
import { TopPage } from "../../../src/endpoints/top-page";
import { AuthInfo } from "../../../src/models/auth-info";
import { ClientParam } from "../../../src/models/client-param";
import { LoginTask } from "../../../src/tasks/login-task";
import { mockEndpointImplementation } from "../../../__helpers__/mock-helper";

jest.mock("../../../src/endpoints/login-page");
jest.mock("../../../src/endpoints/check-authentication-method");
jest.mock("../../../src/endpoints/authenticate");
jest.mock("../../../src/endpoints/top-page");

const LoginPageMock = LoginPage as jest.Mock<LoginPage>;
const CheckAuthenticationMethodMock = CheckAuthenticationMethod as jest.Mock<CheckAuthenticationMethod>;
const AuthenticateMock = Authenticate as jest.Mock<Authenticate>;
const TopPageMock = TopPage as jest.Mock<TopPage>;

describe("LoginTask", () => {
  beforeEach(() => {
    // Clear all instances
    LoginPageMock.mockClear();
    CheckAuthenticationMethodMock.mockClear();
    AuthenticateMock.mockClear();
    TopPageMock.mockClear();
  });

  it("create instance", () => {
    // Given
    const authInfo = ({} as unknown) as AuthInfo;

    // When
    const instance = new LoginTask(authInfo);

    // Then
    expect(instance).toBeInstanceOf(LoginTask);
  });

  it("ログイン実行します", async () => {
    // Given
    const loginId = "login";
    const password = "password";
    const authInfo: AuthInfo = { loginId, password };
    const tenantCode = "ttttt";
    const param: ClientParam = { tenantCode };
    const client = ({ param } as unknown) as BugyoCloudClient;
    const token = "login page token";
    const url = "https://example.com/uuu";
    const userCode = "uuuuu";
    const instance = new LoginTask(authInfo);
    const loginPageInvoke = mockEndpointImplementation(LoginPageMock);
    const authenticateInvoke = mockEndpointImplementation(AuthenticateMock);
    const topPageInvoke = mockEndpointImplementation(TopPageMock);

    loginPageInvoke.mockResolvedValue(token);
    authenticateInvoke.mockResolvedValue(url);
    topPageInvoke.mockResolvedValue(userCode);

    // When
    await instance.execute(client);

    // Then
    // コンストラクタが呼ばれる
    expect(LoginPage).toHaveBeenCalledTimes(1);
    expect(loginPageInvoke).toHaveBeenCalledWith(client);

    expect(CheckAuthenticationMethod).toHaveBeenCalledTimes(1);
    expect(
      CheckAuthenticationMethodMock.mock.instances[0].invoke
    ).toHaveBeenCalledWith(client, token, authInfo);

    expect(Authenticate).toHaveBeenCalledTimes(1);
    expect(authenticateInvoke).toHaveBeenCalledWith(client, token, authInfo);

    expect(TopPage).toHaveBeenCalledTimes(1);
    expect(topPageInvoke).toHaveBeenCalledWith(client, url);

    expect(param.userCode).toBe(userCode);
  });
});
