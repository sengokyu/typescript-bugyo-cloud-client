import mockAxios from "jest-mock-axios";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { PunchmarkPage } from "../../../src/endpoints/punchmark-page";
import { ClientParam } from "../../../src/models/client-param";
import { mockLoggerFactory } from "../../../__helpers__/mock-helper";

describe("PunchmarkPage", () => {
  const loggerFactory = mockLoggerFactory();

  afterEach(() => {
    mockAxios.reset();
  });

  it("トークンを返します", async () => {
    // Given
    const tenantCode = "ttt";
    const userCode = "uuu";
    const param: ClientParam = { tenantCode, userCode };
    const session = mockAxios;
    const client = ({ param, session } as unknown) as BugyoCloudClient;
    const instance = new PunchmarkPage(loggerFactory);
    const data = `
    <form action="http://example.com/">
    <input name="__RequestVerificationToken" value="my token">
    </form>
    `;

    param.userCode = userCode;

    // When
    const actualPromise = instance.invoke(client);

    // Then
    expect(mockAxios.get).toHaveBeenCalledWith(
      `https://hromssp.obc.jp/${tenantCode}/${userCode}/timeclock/punchmark/`,
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
