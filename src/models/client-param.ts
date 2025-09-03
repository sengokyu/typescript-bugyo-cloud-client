export interface ClientParam {
  get tenantCode(): string;
  get userCode(): string | null;
}
