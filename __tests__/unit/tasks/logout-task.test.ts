import {
  mockEndpointImplementation,
  mockLogger,
} from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { CallLogout } from "../../../src/endpoints/call-logout";
import { LogoutTask } from "../../../src/tasks/logout-task";

jest.mock("../../../src/endpoints/call-logout");

const mockedCallLogout = CallLogout as jest.Mock<CallLogout>;

describe("LogoutTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create instance", () => {
    // Given
    // When
    const actual = new LogoutTask(
      mockLogger(),
      mockEndpointImplementation<CallLogout>()
    );

    // Then
    expect(actual).toBeInstanceOf(LogoutTask);
  });

  it("CallLogoutを呼びます", async () => {
    // Given
    const client = {} as unknown as BugyoCloudClient;
    const callLogout = mockEndpointImplementation<CallLogout>();
    const instance = new LogoutTask(mockLogger(), callLogout);

    callLogout.invoke.mockResolvedValue(undefined);

    // when
    const actualPromise = instance.execute(client);

    // Then
    await expect(actualPromise).resolves.toBeUndefined();

    // メソッド呼び出し
    expect(callLogout.invoke).toHaveBeenCalledWith(client);
  });
});
