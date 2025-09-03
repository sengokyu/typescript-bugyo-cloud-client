import { BugyoCloudClient } from "..";
import { WorkflowApply } from "../endpoints/workflow-apply";
import { WorkflowOvertimePage } from "../endpoints/workflow-overtime-page";
import { OvertimeInfo } from "../models/overtime-info";
import { PostRequestTask } from "./base/post-request-task";

/**
 * 時間外申請します。
 */
export class ApplyOvertimeTask extends PostRequestTask<OvertimeInfo> {


  async execute(client: BugyoCloudClient): Promise<void> {
    this.logger.trace("Trying to get the workflow overtime page token.");
    const token = await this.getPageToken(WorkflowOvertimePage, client);

    const workflowApply = new WorkflowApply(this.loggerFactory);




  }
}
