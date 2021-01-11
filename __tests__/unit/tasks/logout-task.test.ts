import { LogoutTask } from "../../../src/tasks/logout-task";

describe("LogoutTask", () => {
  it("create instance", () => {
    // Given
    // When
    const actual = new LogoutTask();

    // Then
    expect(actual).toBeInstanceOf(LogoutTask);
  });
});
