import { EndpointName } from "../../../src/config";
import { ClientParam } from "../../../src/models/client-param";
import { produceUrl } from "../../../src/utils/url-utils";

describe("produceUrl", () => {
  const tenantCode = "ttt";
  const userCode = "uuu";

  it.each([
    ["LoginPage", "https://id.obc.jp/", `https://id.obc.jp/${tenantCode}/`],
    [
      "TimeClock",
      "https://hromssp.obc.jp/",
      `https://hromssp.obc.jp/${tenantCode}/${userCode}/TimeClock/InsertReadDateTime/`,
    ],
  ])(
    "URLを返します",
    (endpoint: string, baseURL: string, absoluteURL: string) => {
      // Given
      const param: ClientParam = { tenantCode, userCode };

      // When
      const actual = produceUrl(endpoint as EndpointName, param);

      // Then
      expect(actual).toStrictEqual({ baseURL, absoluteURL });
    }
  );
});
