import { load } from "cheerio";

/**
 * ページ中にある__RequestVerificationTokenを返します。
 * @param html HTML
 */
export const parseToken = (html: string): string => {
  const $ = load(html);
  const ele = $("input[name=__RequestVerificationToken]");

  if (ele.length === 0) {
    throw new Error("Cannot find a element of __RequestVerificationToken.");
  }

  const val = ele.val();

  if (val === undefined) {
    throw new Error(
      "Cannot get a value attribute of the __RequestVerificationToken."
    );
  }

  if (Array.isArray(val)) {
    throw new Error("Too many __RequestVerificationToken input fields. ");
  }

  return val;
};

/**
 * ページ中にある #ApplicationRoot の href 属性から userCode を返します。
 *
 * @param html
 * @returns
 */
export const parseUserCode = (html: string): string => {
  const $ = load(html);
  const href = $("#ApplicationRoot")?.attr("href");

  if (!href) {
    throw new Error("Cannot find a element of #ApplicationRoot.");
  }

  // /{tenantCode}/{userCode}/
  const parts = href.split("/");

  if (!parts[2]) {
    throw new Error(
      `Cannot parse userCode from #ApplicationRoot. href=${href}`
    );
  }

  return parts[2];
};
