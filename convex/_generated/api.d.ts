/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as chatbot from "../chatbot.js";
import type * as crops from "../crops.js";
import type * as farmers from "../farmers.js";
import type * as http from "../http.js";
import type * as pastCrops from "../pastCrops.js";
import type * as recommendations from "../recommendations.js";
import type * as router from "../router.js";
import type * as weather from "../weather.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chatbot: typeof chatbot;
  crops: typeof crops;
  farmers: typeof farmers;
  http: typeof http;
  pastCrops: typeof pastCrops;
  recommendations: typeof recommendations;
  router: typeof router;
  weather: typeof weather;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
