import { URL } from "url";
import { BugyoCloudClientError } from "../bugyo-cloud-client";
import { EndpointName, URL_TEMPLATE } from "../config";
import { ClientParam } from "../models/client-param";
import { PrettyUrl } from "../models/pretty-url";

/**
 * EndPointに応じたURLを返します
 *
 * @param endpoint
 * @param param
 */
export const produceUrl = (
  endpoint: EndpointName,
  param: ClientParam
): PrettyUrl => {
  const template = URL_TEMPLATE[endpoint];

  return {
    baseURL: template.baseURL,
    absoluteURL:
      template.baseURL +
      template.pathFormatter({
        tenantCode: param.tenantCode,
        userCode: param.userCode,
      }),
  };
};

/**
 * URLのパスの2番目の要素を返します。
 *
 * @param url
 */
export const extractUserCode = (url: string): string => {
  const urlobj = new URL(url);
  const parts = urlobj.pathname.split("/");

  if (parts.length < 3 || parts[2] === "") {
    throw new BugyoCloudClientError(`Unexpected url : ${url}`);
  }

  return parts[2];
};
