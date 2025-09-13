import axios, { AxiosHeaders, AxiosResponse } from "axios";
import { mockLogger } from "../../../__helpers__/mock-helper";
import { HttpSession } from "../../../src/utils/http-session";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("HttpSession", () => {
  beforeEach(() => {
    mockedAxios.request.mockClear();
  });

  it("create instance", () => {
    // When
    const instance = new HttpSession(mockLogger(), mockedAxios);

    // Then
    expect(instance).toBeInstanceOf(HttpSession);
  });

  it("http getします", async () => {
    // Given
    const url = "https://example.com/top";
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
        url,
      })
    );
  });

  it("http postします", async () => {
    // Given
    const url = "https://example.com/top";
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
        url,
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
      headers: { Location: url2 },
    };
    const resp2: Res = {
      status: 302,
      headers: { Location: url3 },
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
    const actualPromise = instance.getAndFollow(url1);

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
