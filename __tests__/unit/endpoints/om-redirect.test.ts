import { mockLogger } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { OmRedirect } from "../../../src/endpoints/om-redirect";

describe("OmRedirect", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("トップのURLを返す", async () => {
    // Given
    const instance = new OmRedirect(mockLogger());
    const tenantCode = "ttttttt";
    const client = { tenantCode, session: { getAndFollow: jest.fn() } };
    const url = "https://example.com/xxx/yyy/ddd";

    client.session.getAndFollow.mockResolvedValue({
      status: 200,
      config: { url },
    });

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient
    );

    // Then
    await expect(actualPromise).resolves.toBe(url);

    expect(client.session.getAndFollow).toHaveBeenCalledWith(
      `https://id.obc.jp/${tenantCode}/omredirect/redirect/`,
      {
        headers: { Referer: `https://id.obc.jp/${tenantCode}` },
      }
    );
  });
});
