/* eslint-disable @typescript-eslint/no-explicit-any */

import { resolveRequestErrorMessage } from "./resolveRequestErrorMessage";

export const getRequestErrorMessage = (error: any, fallbackPrefix: string) => {
    return resolveRequestErrorMessage(error, fallbackPrefix);
};
