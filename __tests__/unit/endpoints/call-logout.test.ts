import * as undici from "undici";
import { mockLogger } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { CallLogout } from "../../../src/endpoints/call-logout";

describe("Logout", () => {
  it("create instance", () => {
    // Given
    // When
    const actual = new CallLogout(mockLogger());

    // Then
    expect(actual).toBeInstanceOf(CallLogout);
  });

  it("Logout URL GETします", async () => {
    // Given
    const tenantCode = "ttt";
    const userCode = "uuu";
    const client = { tenantCode, userCode, session: { get: jest.fn() } };
    const instance = new CallLogout(mockLogger());

    client.session.get.mockResolvedValue({} as undici.Response);

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient
    );

    await expect(actualPromise).resolves.toBeUndefined();

    expect(client.session.get).toHaveBeenCalledWith(
      `https://hromssp.obc.jp/${tenantCode}/${userCode}/calllogout/logout/?manuallogin=True`
    );
  });
});
