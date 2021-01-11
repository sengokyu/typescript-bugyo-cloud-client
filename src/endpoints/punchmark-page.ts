import { EndpointName } from "../config";
import { TokenPage } from "./base/token-page";

export class PunchmarkPage extends TokenPage {
  protected get EndpointName(): EndpointName {
    return "PunchmarkPage";
  }
}
