import mockAxios from "jest-mock-axios";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { LoginPage } from "../../../src/endpoints/login-page";
import { ClientParam } from "../../../src/models/client-param";
import { mockLoggerFactory } from "../../../__helpers__/mock-helper";

describe("LoginPage", () => {
  const loggerFactory = mockLoggerFactory();

  afterEach(() => {
    mockAxios.reset();
  });

  it("トークンを返します", async () => {
    // Given
    const tenantCode = "ttt";
    const param: ClientParam = { tenantCode };
    const session = mockAxios;
    const client = ({ param, session } as unknown) as BugyoCloudClient;
    const instance = new LoginPage(loggerFactory);
    const data = `
    <form action="http://example.com/">
    <input name="__RequestVerificationToken" value="my token">
    </form>
    `;

    // When
    const actualPromise = instance.invoke(client);

    // Then
    expect(mockAxios.get).toHaveBeenCalledWith(
      `https://id.obc.jp/${tenantCode}`,
      {
        responseType: "text",
        maxRedirects: 0,
      }
    );

    // When
    mockAxios.mockResponse({ data });
    const actual = await actualPromise;

    // Then
    expect(actual).toBe("my token");
  });
});
