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
    const client = { tenantCode, session: { getPage: jest.fn() } };
    const userCode = "uuuuuuu";
    const data = `<a id="ApplicationRoot" href="/tenantCode/${userCode}/"></a>`;

    client.session.getPage.mockResolvedValue(data);

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient
    );

    // Then
    await expect(actualPromise).resolves.toBe(userCode);

    expect(client.session.getPage).toHaveBeenCalledWith(
      `https://id.obc.jp/${tenantCode}/omredirect/redirect/`
    );
  });
});
