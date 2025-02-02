import { TokensToRegexpOptions, ParseOptions } from 'path-to-regexp';

import { createServiceSymbol } from '../../utils';

export const IRouteMatcherKey = createServiceSymbol('IRouteMatcherKey');

export interface IRouteMatcher {
  match: (
    path: string,
    route: string,
    params?: Record<string, string>,
    options?: ParseOptions & TokensToRegexpOptions,
  ) => boolean;
}
