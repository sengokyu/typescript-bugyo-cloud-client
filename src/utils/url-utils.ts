import { URL } from "url";
import { BugyoCloudClientError } from "../bugyo-cloud-client";
import { EndpointName, URL_TEMPLATE } from "../config";
import { ClientParam } from "../models/client-param";

/**
 * EndPointに応じたURLを返します
 *
 * @param endpoint
 * @param param
 */
export const produceUrl = (
  endpoint: EndpointName,
  param: ClientParam
): string => URL_TEMPLATE[endpoint](param.tenantCode, param.userCode ?? "");

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
