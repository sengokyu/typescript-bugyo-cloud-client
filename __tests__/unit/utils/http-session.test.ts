import * as undici from "undici";
import { mockLogger } from "../../../__helpers__/mock-helper";
import { HttpSession } from "../../../src/utils/http-session";

jest.mock("undici");

const mockedFetch = undici.fetch as jest.MockedFunction<typeof undici.fetch>;

describe("HttpSession", () => {
  const dispatcher = {} as undici.Dispatcher;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create instance", () => {
    // When
    const instance = new HttpSession(mockLogger(), dispatcher);

    // Then
    expect(instance).toBeInstanceOf(HttpSession);
  });

  it("http getします", async () => {
    // Given
    const url = "https://example.com/top";
    const instance = new HttpSession(mockLogger(), dispatcher);
    const response = { ok: true } as undici.Response;

    mockedFetch.mockResolvedValue(response);

    // When
    const actualPromise = instance.get(url);

    // Then
    expect(actualPromise).resolves.toBe(response);
    expect(mockedFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: "GET",
        dispatcher: dispatcher,
      })
    );
  });

  it("http getしてコンテンツ返します", async () => {
    // Given
    const url = "https://example.com/top";
    const instance = new HttpSession(mockLogger(), dispatcher);
    const response = { ok: true, text: jest.fn() };
    const text = "<html></html>";

    response.text.mockResolvedValue(text);
    mockedFetch.mockResolvedValue(response as unknown as undici.Response);

    // When
    const actualPromise = instance.getPage(url);

    // Then
    expect(actualPromise).resolves.toBe(text);
    expect(mockedFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: "GET",
        dispatcher: dispatcher,
      })
    );
  });

  it("http postします", async () => {
    // Given
    const url = "https://example.com/top";
    const data = '{ data: "data" }';
    const instance = new HttpSession(mockLogger(), dispatcher);
    const response = { ok: true } as undici.Response;

    mockedFetch.mockResolvedValue(response);

    // When
    const actualPromise = instance.post(url, data);

    // Then
    expect(actualPromise).resolves.toBe(response);
    expect(mockedFetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: "POST",
        body: data,
        dispatcher: dispatcher,
      })
    );
  });
});
