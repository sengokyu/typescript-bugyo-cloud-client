import mockAxios from "jest-mock-axios";
import { mockLoggerFactory } from "../../../__helpers__/mock-helper";

describe("OmRedirect", () => {
  const loggerFactory = mockLoggerFactory();

  afterEach(() => {
    mockAxios.reset();
  });

  it("")
});
