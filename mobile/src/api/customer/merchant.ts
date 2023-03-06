import { AxiosResponse } from "axios";
import { paymentsApi } from "../../utils/axios";

export type ICreateMerchant = {
  companyName: string;
  contactPersonFullName: string;
  email: string;
  countryOfRegistration: string;
};

export function createMerchant(
  payload: ICreateMerchant
): Promise<AxiosResponse<unknown, ICreateMerchant>> {
  return paymentsApi.post("/api/customers/merchant", payload);
}
