import axios from "axios";
import { HttpCookieAgent, HttpsCookieAgent } from "http-cookie-agent/http";
import { CookieJar } from "tough-cookie";
import { BugyoCloudClient } from "./bugyo-cloud-client";
import { HttpSession } from "./utils/http-session";

export const createBugyoCloudClient = (tenantCode: string): BugyoCloudClient =>
  new BugyoCloudClient(tenantCode, createHttpSession());

const createHttpSession = (): HttpSession =>
  new HttpSession(createAxiosInstance());

const createAxiosInstance = (): axios.AxiosInstance => {
  const jar = new CookieJar();

  return axios.create({
    httpAgent: new HttpCookieAgent({ cookies: { jar } }),
    httpsAgent: new HttpsCookieAgent({ cookies: { jar } }),
  });
};
