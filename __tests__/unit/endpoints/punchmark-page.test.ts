import { mockLogger } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { PunchmarkPage } from "../../../src/endpoints/punchmark-page";

describe("PunchmarkPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("トークンを返します", async () => {
    // Given
    const tenantCode = "ttt";
    const userCode = "uuu";
    const client = {
      tenantCode,
      userCode,
      session: { getPage: jest.fn() },
    };
    const instance = new PunchmarkPage(mockLogger());
    const data = `
    <form action="http://example.com/">
    <input name="__RequestVerificationToken" value="my token">
    </form>
    `;

    client.session.getPage.mockResolvedValue(data);

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient
    );

    // Then
    await expect(actualPromise).resolves.toBe("my token");

    expect(client.session.getPage).toHaveBeenCalledWith(
      `https://hromssp.obc.jp/${tenantCode}/${userCode}/timeclock/punchmark/`
    );
  });
});
