/**
 * Endpointの実装をモックに差し替えます
 * @param target Endpointのモック
 */
export const mockEndpointImplementation = (target: jest.Mock) => {
  const invoke = jest.fn();

  target.mockImplementation(() => ({ invoke }));

  return invoke;
};
