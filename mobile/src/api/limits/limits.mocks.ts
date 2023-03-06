import { rest } from "msw";
import { backendApiUrl } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Limits } from "./limits.interface";

const defaultLimitsMockResponse: GenericApiResponse<Limits[]> = {
  value: [
    {
      tokenCode: "SCEUR",
      funding: {
        limit: {
          monthly: "500",
        },
        used: {
          monthly: "100",
        },
      },
      withdraw: {
        limit: {
          monthly: "100",
        },
        used: {
          monthly: "20",
        },
      },
    },
  ],
};

export const limitsMocks = [
  rest.get(`${backendApiUrl}/api/customers/limits`, (_req, rest, ctx) => {
    return rest(ctx.status(200), ctx.json(defaultLimitsMockResponse));
  }),
];
