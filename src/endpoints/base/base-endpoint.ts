import { Logger } from "../../utils/logger-factory";

export abstract class BaseEndpoint {
  constructor(protected readonly logger: Logger) {}
}
