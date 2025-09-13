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
