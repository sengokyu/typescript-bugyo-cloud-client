import { BaseEndpoint } from "../src/endpoints/base/base-endpoint";
import { Logger, LoggerFactory } from "../src/utils/logger-factory";
/**
 * Endpointの実装をモックに差し替えます
 */
export function mockEndpointImplementation<
  T extends BaseEndpoint
>(): jest.Mocked<T> {
  return { invoke: jest.fn() } as unknown as jest.Mocked<T>;
}

export function mockLogger(): Logger {
  return {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  };
}

/**
 * モック関数を作成します
 * @param expectedArguments 期待する引数
 * @param returnValue 戻り値
 * @returns
 */
export function mockFnImpl(expectedArguments: any[], returnValue: any) {
  return jest.fn((...args: any[]) => {
    expect(args).toEqual(expectedArguments);
    return returnValue;
  });
}
