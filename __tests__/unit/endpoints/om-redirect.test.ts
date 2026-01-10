import { mockFnImpl, mockLogger } from "../../../__helpers__/mock-helper";
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
    const url = "https://id.obc.jp/ttttttt/omredirect/redirect/";
    const userCode = "uuuuuuu";
    const data = `<a id="ApplicationRoot" href="/tenantCode/${userCode}/"></a>`;
    const client = {
      tenantCode,
      session: { getPage: mockFnImpl([url], Promise.resolve(data)) },
    };

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient,
      url
    );

    // Then
    await expect(actualPromise).resolves.toBe(userCode);
  });
});
