import { LoggerFactory } from "../../../src/utils/logger-factory";

describe("LoggerFactory", () => {
  it("Loggerを返します", () => {
    // When
    const actual = LoggerFactory.getLogger("test");

    // Then
    expect(actual).toBeTruthy();
    // expect(actual).toBeInstanceOf(Logger);
  });
});
