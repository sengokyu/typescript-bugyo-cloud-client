import mockAxios from "jest-mock-axios";
import { mockLoggerFactory } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { CheckAuthenticationMethod } from "../../../src/endpoints/check-authentication-method";
import { AuthInfo } from "../../../src/models/auth-info";
import { ClientParam } from "../../../src/models/client-param";

describe("CheckAuthenticationMethod", () => {
  const loggerFactory = mockLoggerFactory();

  it("LOGIN IDをPOSTします", async () => {
    // Given
    const tenantCode = "ttt";
    const param: ClientParam = { tenantCode, userCode: null };
    const session = mockAxios;
    const client = { param, session } as unknown as BugyoCloudClient;
    const token = "my token";
    const loginId = "log in";
    const password = "pa ss";
    const authInfo: AuthInfo = { loginId, password };
    const instance = new CheckAuthenticationMethod(loggerFactory);

    // When
    const actualPromise = instance.invoke(client, token, authInfo);

    // Then
    expect(mockAxios.post).toHaveBeenCalledWith(
      `https://id.obc.jp/${tenantCode}/login/CheckAuthenticationMethod`,
      {
        OBCiD: loginId,
        isBugyoCloud: "false",
      },
      {
        headers: {
          __RequestVerificationToken: token,
          "X-Requested-With": "XMLHttpRequest",
        },
        maxRedirects: 0,
      }
    );

    // When
    mockAxios.mockResponse({ data: "" });
    await actualPromise;
  });

  it("リダレクトの時は例外発生します", async () => {
    // Given
    const tenantCode = "ttt";
    const param: ClientParam = { tenantCode, userCode: null };
    const session = mockAxios;
    const client = { param, session } as unknown as BugyoCloudClient;
    const token = "my token";
    const loginId = "log in";
    const password = "pa ss";
    const authInfo: AuthInfo = { loginId, password };
    const instance = new CheckAuthenticationMethod(loggerFactory);

    // When
    const actualPromise = instance.invoke(client, token, authInfo);

    // THen
    expect(mockAxios.post).toHaveBeenCalled();

    // When
    mockAxios.mockResponse({ status: 301, data: "" });

    // Then
    await expect(actualPromise).rejects.toThrow();
  });
});
