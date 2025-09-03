import { EndpointName } from "../config";
import { TokenPage } from "./base/token-page";

/**
 * 時間外申請ページ
 */
export class WorkflowOvertimePage extends TokenPage {
  protected get EndpointName(): EndpointName {
    return "WorkflowOvertimePage";
  }
}
