import axios, { AxiosStatic } from "axios";
import { ClientParam } from "../../../dist/models/client-param";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { TopPage } from "../../../src/endpoints/top-page";

// 何回もリクエストするため、jest-mock-axiosは使わず、自前でやる
jest.mock("axios");

const axiosMock = (axios as unknown) as jest.Mock<AxiosStatic>;

describe("TopPage", () => {
  beforeEach(() => {
    axiosMock.mockClear();
  });

  it("create instance", () => {
    // Given
    // When
    const actual = new TopPage();

    // Then
    expect(actual).toBeInstanceOf(TopPage);
  });

  it("UserCodeを返す", async () => {
    // Given
    const param = {} as ClientParam;
    const session = axios;
    const client = ({ param, session } as unknown) as BugyoCloudClient;
    const url = "https://example.com/top";
    const responseUrl = "https://example.com/xxx/yyy/ddd";
    const instance = new TopPage();

    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      config: { url: responseUrl },
      data: "",
    });

    // When
    const actual = await instance.invoke(client, url);

    // Then
    expect(axios.get).toHaveBeenCalledWith(url, {
      maxRedirects: 0,
    });
    expect(actual).toBe("yyy");
  });

  it("Redirectに追随する", async () => {
    // Given
    const param = {} as ClientParam;
    const session = axios;
    const client = ({ param, session } as unknown) as BugyoCloudClient;
    const url1 = "https://example.com/1";
    const url2 = "https://example.com/2";
    const url3 = "https://example.com/3";
    const topUrl = "https://example.com/tenantCode/userCode/z";
    const resp1 = { status: 302, headers: { location: url2 }, data: "" };
    const resp2 = { status: 302, headers: { location: url3 }, data: "" };
    const resp3 = { status: 200, config: { url: topUrl }, data: "" };
    const urlRespMap: { [index: string]: any } = {};
    const instance = new TopPage();

    urlRespMap[url1] = resp1;
    urlRespMap[url2] = resp2;
    urlRespMap[url3] = resp3;

    // 各URLごとにレスポンスを返す
    (axios.get as jest.Mock).mockImplementation((url) =>
      Promise.resolve(urlRespMap[url])
    );

    // When
    await instance.invoke(client, url1);

    // Then
    const expectedConfig = { maxRedirects: 0 };
    expect(axios.get).toHaveBeenCalledWith(url1, expectedConfig);
    expect(axios.get).toHaveBeenCalledWith(url2, expectedConfig);
    expect(axios.get).toHaveBeenCalledWith(url3, expectedConfig);
  });
});
