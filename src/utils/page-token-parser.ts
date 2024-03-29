import { load } from "cheerio";
import { BugyoCloudClientError } from "../bugyo-cloud-client";

/**
 * ページ中にある__RequestVerificationTokenを返します。
 * @param html HTML
 */
export const parseToken = (html: string): string => {
  const $ = load(html);
  const ele = $("input[name=__RequestVerificationToken]");

  if (ele.length === 0) {
    new BugyoCloudClientError(
      "Cannot find a element of __RequestVerificationToken."
    );
  }

  const val = ele.val();

  if (val === undefined) {
    throw new BugyoCloudClientError(
      "Cannot get a value attribute of the __RequestVerificationToken."
    );
  }

  if (Array.isArray(val)) {
    throw new BugyoCloudClientError(
      "Too many __RequestVerificationToken input fields. "
    );
  }

  return val;
};
