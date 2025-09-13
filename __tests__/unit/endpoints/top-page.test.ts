import { mockLogger } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { BASE_URL } from "../../../src/config";
import { TopPage } from "../../../src/endpoints/top-page";
import { extractUserCode } from "../../../src/utils/url-utils";

jest.mock("../../../src/utils/url-utils");

describe("TopPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create instance", () => {
    // Given
    // When
    const actual = new TopPage(mockLogger());

    // Then
    expect(actual).toBeInstanceOf(TopPage);
  });

  it("UserCodeを返す", async () => {
    // Given
    const client = { session: { getAndFollow: jest.fn() } };
    const url = "https://example.com/top";
    const responseUrl = "https://example.com/xxx/yyy/ddd";
    const userCode = "yyy";
    const instance = new TopPage(mockLogger());

    client.session.getAndFollow.mockResolvedValue({
      status: 200,
      config: { url: responseUrl },
    });

    (extractUserCode as jest.Mock).mockReturnValue(userCode);

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient,
      url
    );

    // Then
    await expect(actualPromise).resolves.toBe(userCode);

    expect(client.session.getAndFollow).toHaveBeenCalledWith(url, {
      baseURL: BASE_URL,
    });
    expect(extractUserCode).toHaveBeenCalledWith(responseUrl);
  });
});
