import {
  mockEndpointImplementation,
  mockLoggerFactory,
} from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src";
import { CallLogout } from "../../../src/endpoints/call-logout";
import { LogoutTask } from "../../../src/tasks/logout-task";

jest.mock("../../../src/endpoints/call-logout");

const mockedCallLogout = CallLogout as jest.Mock<CallLogout>;

describe("LogoutTask", () => {
  const loggerFactory = mockLoggerFactory();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create instance", () => {
    // Given
    // When
    const actual = new LogoutTask(loggerFactory);

    // Then
    expect(actual).toBeInstanceOf(LogoutTask);
  });

  it("CallLogoutを呼びます", async () => {
    // Given
    const client = {} as unknown as BugyoCloudClient;
    const callLogoutInvoke = mockEndpointImplementation(mockedCallLogout);
    const instance = new LogoutTask(loggerFactory);

    callLogoutInvoke.mockResolvedValue(undefined);

    // when
    const actualPromise = instance.execute(client);

    // Then
    await expect(actualPromise).resolves.toBeUndefined();

    // コンストラクタ呼び出し
    expect(mockedCallLogout).toHaveBeenCalled();
    // メソッド呼び出し
    expect(callLogoutInvoke).toHaveBeenCalledWith(client);
  });
});
