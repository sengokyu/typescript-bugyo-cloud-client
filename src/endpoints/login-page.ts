import { EndpointName } from "../config";
import { TokenPage } from "./base/token-page";

export class LoginPage extends TokenPage {
  protected get EndpointName(): EndpointName {
    return "LoginPage";
  }
}
