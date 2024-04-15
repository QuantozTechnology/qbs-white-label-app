// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as React from "react";
import { useEffect } from "react";
import {
  CustomerStateType,
  CustomerState,
  CustomerStateAction,
  CustomerStateActionType,
  CustomerStateContext,
} from "./customerContext.interface";
import { getCustomer } from "../api/customer/customer";
import { getAccount } from "../api/account/account";
import { AxiosError } from "axios";
import { isNil } from "lodash";

// We initialize the context with default values and override them later
const CustomerContext = React.createContext<CustomerStateContext | null>(null);

export function useCustomerState() {
  return React.useContext(CustomerContext);
}

export function CustomerProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const initialState: CustomerState = {
    isLoading: false,
    error: null,
    state: null,
  };

  function reducer(
    _state: CustomerState,
    action: CustomerStateAction
  ): CustomerState {
    switch (action.type) {
      case CustomerStateActionType.INIT: {
        return { ...initialState, isLoading: true };
      }
      case CustomerStateActionType.ERROR: {
        return { ..._state, isLoading: false, error: action.errorMessage };
      }
      case CustomerStateActionType.UPDATE_STATE: {
        return {
          ..._state,
          isLoading: false,
          state: action.state,
          error: null,
          is_business: null,
        };
      }
      default: {
        throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
      }
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initialState);

  useEffect(() => {
    async function setState() {
      await updateState();
    }

    setState();
  }, []);

  async function refresh() {
    await updateState();
  }

  async function updateState() {
    dispatch({ type: CustomerStateActionType.INIT });

    const customerExists = await updateCustomerState();

    if (customerExists) {
      const accountExists = await updateAccountState();
      if (accountExists) {
        dispatch({
          type: CustomerStateActionType.UPDATE_STATE,
          state: CustomerStateType.READY,
        });
      }
    }
  }

  async function updateCustomerState() {
    const customerResponse = await getCustomer();
    if (!isNil(customerResponse)) {
      if (customerResponse?.data.value.status === "UNDERREVIEW") {
        dispatch({
          type: CustomerStateActionType.UPDATE_STATE,
          state: CustomerStateType.CUSTOMER_UNDER_REVIEW,
          is_business: customerResponse?.data.value.isBusiness,
        });
        return false;
      }
      if (customerResponse?.data.value.status === "BLOCKED") {
        dispatch({
          type: CustomerStateActionType.UPDATE_STATE,
          state: CustomerStateType.CUSTOMER_UNDER_REVIEW,
          is_business: customerResponse?.data.value.isBusiness,
        });
        return false;
      }
      if (customerResponse?.data.value.status === "NEW") {
        dispatch({
          type: CustomerStateActionType.UPDATE_STATE,
          state: CustomerStateType.CUSTOMER_UNDER_REVIEW,
          is_business: customerResponse?.data.value.isBusiness,
        });
        return false;
      }
      if (customerResponse?.data.value.status === "DELETED") {
        dispatch({
          type: CustomerStateActionType.UPDATE_STATE,
          state: CustomerStateType.CUSTOMER_UNDER_REVIEW,
          is_business: customerResponse?.data.value.isBusiness,
        });
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  async function updateAccountState() {
    try {
      await getAccount();
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 404) {
        dispatch({
          type: CustomerStateActionType.UPDATE_STATE,
          state: CustomerStateType.ACCOUNT_REQUIRED,
        });
        return false;
      }

      dispatch({
        type: CustomerStateActionType.ERROR,
        errorMessage: "error message",
      });
      return false;
    }

    return true;
  }

  const customerContext: CustomerStateContext = {
    isUnderReview: state.state
      ? state.state === CustomerStateType.CUSTOMER_UNDER_REVIEW
      : null,
    isBlocked: state.state
      ? state.state === CustomerStateType.CUSTOMER_BLOCKED
      : null,
    isNew: state.state ? state.state === CustomerStateType.CUSTOMER_NEW : null,
    isDeleted: state.state
      ? state.state === CustomerStateType.CUSTOMER_DELETED
      : null,
    requiresCustomer: state.state
      ? state.state === CustomerStateType.CUSTOMER_REQUIRED
      : null,
    requiresAccount: state.state
      ? state.state === CustomerStateType.ACCOUNT_REQUIRED
      : null,
    error: state.error,
    isLoading: state.isLoading,
    refresh: refresh,
    is_business: state.is_business,
  };

  return (
    <CustomerContext.Provider value={customerContext}>
      {children}
    </CustomerContext.Provider>
  );
}
