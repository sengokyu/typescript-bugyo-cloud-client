import { parseToken } from "../../../src/utils/page-token-parser";
describe("parseToken", (): void => {
  const CONTENT = `
  <form id="loginform" action="http://example.com/">
  <input name="__RequestVerificationToken" value="token value">
  </form>
  `;

  it("コンテンツをパースします", () => {
    // Given
    // When
    const actual = parseToken(CONTENT);

    // Then
    expect(actual).toBe("token value");
  });
});
