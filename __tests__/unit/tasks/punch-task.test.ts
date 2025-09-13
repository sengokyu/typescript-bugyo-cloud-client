import {
  mockEndpointImplementation,
  mockLoggerFactory,
} from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { PunchmarkPage } from "../../../src/endpoints/punchmark-page";
import { TimeClock } from "../../../src/endpoints/time-clock";
import { PunchInfo } from "../../../src/models/punch-info";
import { PunchTask } from "../../../src/tasks/punch-task";

jest.mock("../../../src/endpoints/punchmark-page");
jest.mock("../../../src/endpoints/time-clock");

const PunchmarkPageMock = PunchmarkPage as jest.Mock<PunchmarkPage>;
const TimeClockMock = TimeClock as jest.Mock<TimeClock>;

describe("PunchTask", () => {
  const loggerFactory = mockLoggerFactory();

  beforeEach(() => {
    // Clear all instances
    PunchmarkPageMock.mockClear();
    TimeClockMock.mockClear();
  });

  it("create instance", () => {
    // Given
    const punchInfo = {} as PunchInfo;

    // When
    const instance = new PunchTask(punchInfo, loggerFactory);

    // Then
    expect(instance).toBeInstanceOf(PunchTask);
  });

  it("打刻します", async () => {
    // Given
    const tenantCode = "ttttt";
    const userCode = "uuuuu";
    const client = { tenantCode, userCode } as BugyoCloudClient;
    const punchmarkPageInvoke = mockEndpointImplementation(PunchmarkPageMock);
    const timeClockInvoke = mockEndpointImplementation(TimeClockMock);
    const token = "my token";
    const punchInfo = {} as PunchInfo;
    const instance = new PunchTask(punchInfo, loggerFactory);

    punchmarkPageInvoke.mockResolvedValue(token);

    // When
    await instance.execute(client);

    // Then
    // コンストラクタが呼ばれる
    expect(PunchmarkPage).toHaveBeenCalledTimes(1);
    expect(punchmarkPageInvoke).toHaveBeenCalledWith(client);

    expect(TimeClock).toHaveBeenCalledTimes(1);
    expect(timeClockInvoke).toHaveBeenCalledWith(client, token, punchInfo);
  });
});
