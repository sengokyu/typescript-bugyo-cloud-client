import mockAxios from "jest-mock-axios";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { TimeClock } from "../../../src/endpoints/time-clock";
import { ClientParam } from "../../../src/models/client-param";
import { PunchInfo } from "../../../src/models/punch-info";
import { mockLoggerFactory } from "../../../__helpers__/mock-helper";

describe("TimeClock", () => {
  const loggerFactory = mockLoggerFactory();

  afterEach(() => {
    mockAxios.reset();
  });

  it("打刻情報POSTします", async () => {
    // Given
    const tenantCode = "ttt";
    const userCode = "uuu;";
    const param: ClientParam = { tenantCode, userCode };
    const session = mockAxios;
    const client = ({ param, session } as unknown) as BugyoCloudClient;
    const token = "my token";
    const punchInfo: PunchInfo = {
      clockType: "ClockIn",
    };
    const instance = new TimeClock(loggerFactory);

    // When
    const actualPromise = instance.invoke(client, token, punchInfo);

    // Then
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
      Referer: `https://hromssp.obc.jp/${tenantCode}/${userCode}/timeclock/punchmark/`,
    };
    expect(mockAxios.post).toHaveBeenCalledWith(expectedUrl, expectedData, {
      headers: expectedHeaders,
      maxRedirects: 0,
    });

    // When
    mockAxios.mockResponse({ status: 200, data: "" });
    await actualPromise;
  });
});
