import { LogoutTask } from "../../../src/tasks/logout-task";
import { mockLoggerFactory } from "../../../__helpers__/mock-helper";

describe("LogoutTask", () => {
  const loggerFactory = mockLoggerFactory();

  it("create instance", () => {
    // Given
    // When
    const actual = new LogoutTask(loggerFactory);

    // Then
    expect(actual).toBeInstanceOf(LogoutTask);
  });
});
