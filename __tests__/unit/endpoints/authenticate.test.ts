import { mockFnImpl, mockLogger } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { Authenticate } from "../../../src/endpoints/authenticate";
import { AuthInfo } from "../../../src/models/auth-info";

describe("Authenticate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証情報をPOSTします", async () => {
    // Given
    const tenantCode = "ttt";
    const token = "my token";
    const loginId = "log in";
    const password = "pa ss";
    const authInfo: AuthInfo = { loginId, password };
    const instance = new Authenticate(mockLogger());
    const redirectUrl = "https://id.obc.jp/ttt/some-redirect-url";
    const url = `https://id.obc.jp/${tenantCode}/login/login/`;
    const expectedData = [
      "btnLogin=",
      "OBCID=log%20in",
      "Password_d1=",
      "Password_d2=",
      "Password_d3=",
      "Password=pa%20ss",
      "__RequestVerificationToken=my%20token",
      "X-Requested-With=XMLHttpRequest",
    ].join("&");
    const expectedOptions = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
    };
    const mockResult = {
      json: () => Promise.resolve({ RedirectURL: redirectUrl }),
    };
    const client = {
      tenantCode,
      session: {
        post: mockFnImpl(
          [url, expectedData, expectedOptions],
          Promise.resolve(mockResult)
        ),
      },
    };

    // When
    const actual = await instance.invoke(
      client as unknown as BugyoCloudClient,
      token,
      authInfo
    );

    // Then
    expect(actual).toBe(redirectUrl);
  });
});
