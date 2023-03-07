import { useInfiniteQuery } from "@tanstack/react-query";
import { paymentsApi } from "../../utils/axios";
import { GenericApiResponse } from "../utils/api.interface";
import { Transaction } from "./transactions.interface";

const getTransactions = async ({ pageParam = 1 }) => {
  const { data, headers } = await paymentsApi.get<
    GenericApiResponse<Transaction[]>
  >(`/api/transactions?page=${pageParam}&pageSize=10`);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nextPage = JSON.parse(headers["x-pagination"]!).NextPage;
  return { ...data, nextPage };
};

export function useTransactions() {
  return useInfiniteQuery(["transactions"], getTransactions, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    refetchInterval: 5000,
  });
}
