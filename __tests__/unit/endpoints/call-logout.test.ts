import { CallLogout } from "../../../src/endpoints/calll-logout";
import { mockLoggerFactory } from "../../../__helpers__/mock-helper";

describe("CallLogout", () => {
  const loggerFactory = mockLoggerFactory();

  it("create instance", () => {
    // Given
    // When
    const actual = new CallLogout(loggerFactory);

    // Then
    expect(actual).toBeInstanceOf(CallLogout);
  });
});
