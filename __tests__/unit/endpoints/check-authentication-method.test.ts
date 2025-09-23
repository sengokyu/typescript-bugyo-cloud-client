import { mockLogger } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { CheckAuthenticationMethod } from "../../../src/endpoints/check-authentication-method";
import { AuthInfo } from "../../../src/models/auth-info";

describe("CheckAuthenticationMethod", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("LOGIN IDをPOSTします", async () => {
    // Given
    const tenantCode = "ttt";
    const client = {
      tenantCode,
      session: { post: jest.fn() },
    };
    const token = "my token";
    const loginId = "log in";
    const password = "pa ss";
    const authInfo: AuthInfo = { loginId, password };
    const instance = new CheckAuthenticationMethod(mockLogger());
    const response = { ok: true, json: jest.fn() };
    const json = { AuthenticationMethod: 1 };

    response.json.mockResolvedValue(json);
    client.session.post.mockResolvedValue(response);

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient,
      token,
      authInfo
    );

    // Then
    await expect(actualPromise).resolves.toBeUndefined();
    expect(client.session.post).toHaveBeenCalledWith(
      `https://id.obc.jp/${tenantCode}/login/CheckAuthenticationMethod`,
      `OBCiD=${encodeURIComponent(loginId)}&isBugyoCloud=false`,
      {
        headers: {
          __RequestVerificationToken: token,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
        },
        redirect: "error",
      }
    );
  });
});
