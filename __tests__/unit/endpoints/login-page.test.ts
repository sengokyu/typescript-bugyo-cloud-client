import { mockLogger } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { LoginPage } from "../../../src/endpoints/login-page";

describe("LoginPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("トークンを返します", async () => {
    // Given
    const tenantCode = "ttt";
    const client = { tenantCode, session: { get: jest.fn() } };
    const instance = new LoginPage(mockLogger());
    const data = `
    <form action="http://example.com/">
    <input name="__RequestVerificationToken" value="my token">
    </form>
    `;

    client.session.get.mockResolvedValue({ status: 200, data });

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient
    );

    // Then
    await expect(actualPromise).resolves.toBe("my token");

    expect(client.session.get).toHaveBeenCalledWith(
      {
        absoluteURL: `https://id.obc.jp/${tenantCode}/`,
        baseURL: "https://id.obc.jp/",
      },
      {
        responseType: "text",
        maxRedirects: 0,
      }
    );
  });
});
