import { CallLogout } from "../../../src/endpoints/calll-logout";

describe("CallLogout", () => {
  it("create instance", () => {
    // Given
    // When
    const actual = new CallLogout();

    // Then
    expect(actual).toBeInstanceOf(CallLogout);
  });
});
