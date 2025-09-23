import { mockLogger } from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { TimeClock } from "../../../src/endpoints/time-clock";
import { PunchInfo } from "../../../src/models/punch-info";
import * as undici from "undici";

describe("TimeClock", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("打刻情報POSTします", async () => {
    // Given
    const tenantCode = "ttt";
    const userCode = "uuu;";
    const client = {
      tenantCode,
      userCode,
      session: { post: jest.fn() },
    };
    const token = "my token";
    const punchInfo: PunchInfo = {
      clockType: "ClockIn",
    };
    const instance = new TimeClock(mockLogger());

    client.session.post.mockResolvedValue({ status: 200, data: "" });

    // When
    const actualPromise = instance.invoke(
      client as unknown as BugyoCloudClient,
      token,
      punchInfo
    );

    // Then
    await expect(actualPromise).resolves.toBeUndefined();

    const expectedUrl = `https://hromssp.obc.jp/${tenantCode}/${userCode}/TimeClock/InsertReadDateTime/`;
    const expectedData = [
      "ClockType=ClockIn",
      "LaborSystemID=0",
      "LaborSystemCode=",
      "LaborSystemName=",
      "PositionLatitude=0",
      "PositionLongitude=0",
      "PositionAccuracy=0",
    ].join("&");
    const expectedHeaders = {
      __RequestVerificationToken: token,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
    };
    expect(client.session.post).toHaveBeenCalledWith(
      expectedUrl,
      expectedData,
      {
        headers: expectedHeaders,
      }
    );
  });
});
