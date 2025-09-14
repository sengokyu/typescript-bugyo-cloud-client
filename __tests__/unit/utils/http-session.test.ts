import axios, { AxiosHeaders, AxiosResponse } from "axios";
import { mockLogger } from "../../../__helpers__/mock-helper";
import { HttpSession } from "../../../src/utils/http-session";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("HttpSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create instance", () => {
    // When
    const instance = new HttpSession(mockLogger(), mockedAxios);

    // Then
    expect(instance).toBeInstanceOf(HttpSession);
  });

  it("http getします", async () => {
    // Given
    const url = {
      absoluteURL: "https://example.com/top",
      baseURL: "https://example.com",
    };
    const data = { data: "data" };
    const instance = new HttpSession(mockLogger(), mockedAxios);

    mockedAxios.request.mockResolvedValue({
      status: 200,
      data,
    });

    // When
    const actualPromise = instance.get(url);

    // Then
    expect(actualPromise).resolves.toStrictEqual({ status: 200, data });
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "get",
        url: url.absoluteURL,
      })
    );
  });

  it("http postします", async () => {
    // Given
    const url = {
      absoluteURL: "https://example.com/top",
      baseURL: "https://example.com",
    };
    const data = { data: "data" };
    const instance = new HttpSession(mockLogger(), mockedAxios);

    mockedAxios.request.mockResolvedValue({
      status: 200,
      data,
    });

    // When
    const actualPromise = instance.post(url, data);

    // Then
    expect(actualPromise).resolves.toStrictEqual({ status: 200, data });
    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "post",
        url: url.absoluteURL,
        data,
      })
    );
  });

  it("リダイレクトに追随します", async () => {
    type Res = Pick<AxiosResponse, "status" | "headers">;

    // Given
    const url1 = "https://example.com/1";
    const url2 = "https://example.com/2";
    const url3 = "https://example.com/3";
    const resp1: Res = {
      status: 302,
      headers: { location: url2 },
    };
    const resp2: Res = {
      status: 302,
      headers: { location: url3 },
    };
    const resp3: Res = {
      status: 200,
      headers: new AxiosHeaders(),
    };
    const instance = new HttpSession(mockLogger(), mockedAxios);

    // 各URLに対応したレスポンスを返す
    mockedAxios.request
      .mockResolvedValueOnce(resp1)
      .mockResolvedValueOnce(resp2)
      .mockResolvedValueOnce(resp3);

    // When
    const actualPromise = instance.getAndFollow({
      absoluteURL: url1,
      baseURL: "https://example.com/",
    });

    // Then
    await expect(actualPromise).resolves.toBe(resp3);

    expect(mockedAxios.request).toHaveBeenCalledTimes(3);

    expect(mockedAxios.request).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ maxRedirects: 0, url: url1 })
    );
    expect(mockedAxios.request).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ maxRedirects: 0, url: url2 })
    );
    expect(mockedAxios.request).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ maxRedirects: 0, url: url3 })
    );
  });
});
