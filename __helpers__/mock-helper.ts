import { Logger, LoggerFactory } from "../src/utils/logger-factory";
/**
 * Endpointの実装をモックに差し替えます
 * @param target Endpointのモック
 */
export const mockEndpointImplementation = (target: jest.Mock) => {
  const invoke = jest.fn();

  target.mockImplementation(() => ({ invoke }));

  return invoke;
};

export const mockLoggerFactory = (): LoggerFactory => {
  const getLogger = jest.fn<Logger, []>(() => ({
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  }));
  const mock = jest.fn<LoggerFactory, []>(() => ({ getLogger }));
  return new mock();
};
