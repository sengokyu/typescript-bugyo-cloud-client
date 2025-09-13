import {
  mockEndpointImplementation,
  mockLogger,
} from "../../../__helpers__/mock-helper";
import { BugyoCloudClient } from "../../../src/bugyo-cloud-client";
import { PunchmarkPage } from "../../../src/endpoints/punchmark-page";
import { TimeClock } from "../../../src/endpoints/time-clock";
import { PunchInfo } from "../../../src/models/punch-info";
import { PunchTask } from "../../../src/tasks/punch-task";

describe("PunchTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create instance", () => {
    // Given
    const punchInfo = {} as PunchInfo;

    // When
    const instance = new PunchTask(
      mockLogger(),
      mockEndpointImplementation<TimeClock>(),
      mockEndpointImplementation<PunchmarkPage>(),
      punchInfo
    );

    // Then
    expect(instance).toBeInstanceOf(PunchTask);
  });

  it("打刻します", async () => {
    // Given
    const tenantCode = "ttttt";
    const userCode = "uuuuu";
    const client = { tenantCode, userCode } as BugyoCloudClient;
    const timeClock = mockEndpointImplementation<TimeClock>();
    const punchmarkPage = mockEndpointImplementation<PunchmarkPage>();
    const token = "my token";
    const punchInfo = {} as PunchInfo;
    const instance = new PunchTask(
      mockLogger(),
      timeClock,
      punchmarkPage,
      punchInfo
    );

    timeClock.invoke.mockResolvedValue(undefined);
    punchmarkPage.invoke.mockResolvedValue(token);

    // When
    const actualPromise = instance.execute(client);

    // Then
    await expect(actualPromise).resolves.toBeUndefined();
    expect(punchmarkPage.invoke).toHaveBeenCalledWith(client);
    expect(timeClock.invoke).toHaveBeenCalledWith(client, token, punchInfo);
  });
});
