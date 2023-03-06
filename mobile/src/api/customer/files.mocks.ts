import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";

export const filesMocks = [
  rest.post(
    `${backendApiUrl}/api/customers/files/IdFront`,
    (req, rest, ctx) => {
      return rest(ctx.status(201));
    }
  ),
];
