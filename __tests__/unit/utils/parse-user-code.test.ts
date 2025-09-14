import { parseUserCode } from "../../../src/utils/page-parser";

describe("parseUserCode", (): void => {
  it("コンテンツをパースします", () => {
    // Given
    const content = `
  <a id="ApplicationRoot" href="/tenantCode/userCode/"></a>
  `;

    // When
    const actual = parseUserCode(content);

    // Then
    expect(actual).toBe("userCode");
  });

  it("userCodeが取れないときは例外を投げます", () => {
    // Given
    const content = `
    <a id="ApplicationRoot" href="/tenantCode/"></a>
    `;

    // When
    const f = (): void => {
      parseUserCode(content);
    };

    // Then
    expect(f).toThrow(/Cannot parse userCode from #ApplicationRoot./);
  });

  it("#ApplicationRootが取れないときは例外を投げます", () => {
    // Given
    const content = `
    <a id="hoge" href="/tenantCode/userCode/"></a>
    `;

    // When
    const f = (): void => {
      parseUserCode(content);
    };

    // Then
    expect(f).toThrow(/Cannot find a element of #ApplicationRoot./);
  });
});
