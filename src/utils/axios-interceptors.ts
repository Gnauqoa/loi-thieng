import axios from "axios";
import { ensureArray } from "./helpers";
import commonInterceptor from "./axios-interceptor-common";

const interceptors = [
  commonInterceptor, // check and add header to payload data
];

const requestHooks = [];
const responseHooks = [];
const errorHooks = [];

for (const interceptor of interceptors) {
  requestHooks.push(...ensureArray(interceptor.request));
  responseHooks.push(...ensureArray(interceptor.response));
  errorHooks.push(...ensureArray(interceptor.error));
}

/**
 * Before request interceptor
 */
for (const hook of requestHooks.reverse()) {
  axios.interceptors.request.use(hook as (value: any) => any | Promise<any>);
}

/**
 * Before response interceptor
 */
for (const hook of responseHooks) {
  axios.interceptors.response.use(hook as (value: any) => any | Promise<any>);
}
for (const hook of errorHooks) {
  axios.interceptors.response.use(
    undefined,
    hook as (error: any) => any | Promise<any>
  );
}
