import { mockLoggerFactory } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { CallLogout } from "../../../src/endpoints/call-logout";
import { produceUrl } from "../../../src/utils/url-utils";

jest.mock("../../../src/utils/url-utils");

describe("Logout", () => {
  const loggerFactory = mockLoggerFactory();

  it("create instance", () => {
    // Given
    // When
    const actual = new CallLogout(loggerFactory);

    // Then
    expect(actual).toBeInstanceOf(CallLogout);
  });

  it("Logout URL GETします", async () => {
    // Given
    const url = "https://test.example.com";
    const client = { session: { get: jest.fn() } };
    const instance = new CallLogout(loggerFactory);

    client.session.get.mockResolvedValue({ status: 200 });
    (produceUrl as jest.Mock).mockReturnValue(url);

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient
    );

    await expect(actualPromise).resolves.toBeUndefined();

    expect(produceUrl).toHaveBeenCalledWith("CallLogout", client);
    expect(client.session.get).toHaveBeenCalledWith(url);
  });
});
