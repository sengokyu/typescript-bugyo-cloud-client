import mockAxios from "jest-mock-axios";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { Authenticate } from "../../../src/endpoints/authenticate";
import { AuthInfo } from "../../../src/models/auth-info";
import { ClientParam } from "../../../src/models/client-param";

describe("Authenticate", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("認証情報をPOSTします", async () => {
    // Given
    const tenantCode = "ttt";
    const param: ClientParam = { tenantCode };
    const session = mockAxios;
    const client = ({ param, session } as unknown) as BugyoCloudClient;
    const token = "my token";
    const loginId = "log in";
    const password = "pa ss";
    const authInfo: AuthInfo = { loginId, password };
    const instance = new Authenticate();
    const url = "hoge hoge";

    // When
    const actualPromise = instance.invoke(client, token, authInfo);

    // Then
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
    expect(mockAxios.post).toHaveBeenCalledWith(
      `https://id.obc.jp/${tenantCode}/login/login/?Length=5`,
      expectedData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // When
    mockAxios.mockResponse({ data: { RedirectURL: url } });
    const actual = await actualPromise;

    // Then
    expect(actual).toBe(url);
  });
});
