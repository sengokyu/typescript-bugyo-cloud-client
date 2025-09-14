import { mockLogger } from "../../../__helpers__/mock-helper";
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
    const client = { tenantCode, session: { post: jest.fn() } };
    const token = "my token";
    const loginId = "log in";
    const password = "pa ss";
    const authInfo: AuthInfo = { loginId, password };
    const instance = new Authenticate(mockLogger());

    // When
    client.session.post.mockResolvedValue({ status: 200 });
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient,
      token,
      authInfo
    );

    // Then
    await expect(actualPromise).resolves.toBeUndefined();

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
    expect(client.session.post).toHaveBeenCalledWith(
      {
        absoluteURL: `https://id.obc.jp/${tenantCode}/login/login/`,
        baseURL: "https://id.obc.jp/",
      },
      expectedData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
  });
});
