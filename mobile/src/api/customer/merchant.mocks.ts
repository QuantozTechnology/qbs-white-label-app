import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";

export const merchantMocks = [
  rest.post(`${backendApiUrl}/api/customers/merchant`, (_req, rest, ctx) => {
    return rest(ctx.status(201));
  }),
];
