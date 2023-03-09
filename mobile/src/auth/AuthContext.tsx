// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import * as React from "react";
import {
  AuthAction,
  AuthActionType,
  AuthContextType,
  AuthState,
} from "./types";
import { AuthService } from "./authService";
import { useEffect } from "react";

const auth = AuthService();

// We initialize the context with default values and override them later
const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialState: AuthState = {
    isLoading: false,
    userSession: null,
    error: null,
  };

  function reducer(_state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
      case AuthActionType.INIT: {
        return { ..._state, isLoading: true };
      }
      case AuthActionType.ERROR: {
        return { ..._state, isLoading: false, error: action.errorMessage };
      }
      case AuthActionType.SET_USER_SESSION: {
        return {
          ..._state,
          isLoading: false,
          userSession: action.userSession,
          error: null,
        };
      }
      case AuthActionType.CLEAR_USER_SESSION: {
        return { ..._state, isLoading: false, userSession: null, error: null };
      }
      case AuthActionType.CHANGE_PASSWORD_SUCCESS: {
        return { ..._state, isLoading: false, error: null };
      }
      default: {
        throw new Error(`Unhandled action type - ${JSON.stringify(action)}`);
      }
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initialState);

  useEffect(() => {
    async function setUserSession() {
      dispatch({ type: AuthActionType.INIT });
      const response = await auth.getUserSession();

      if (response.type === "error") {
        dispatch({ type: AuthActionType.CLEAR_USER_SESSION });
        return;
      }

      dispatch({
        type: AuthActionType.SET_USER_SESSION,
        userSession: response.userSession,
      });
    }

    setUserSession();
  }, []);

  /**
   * Prompt a user to login
   */
  async function login() {
    dispatch({ type: AuthActionType.INIT });

    const loginResponse = await auth.login();

    if (loginResponse.type === "error") {
      dispatch({
        type: AuthActionType.ERROR,
        errorMessage: loginResponse.errorMessage,
      });
      return;
    }

    const userSessionResponse = await auth.getUserSession();

    if (userSessionResponse.type === "error") {
      dispatch({
        type: AuthActionType.ERROR,
        errorMessage: userSessionResponse.errorMessage,
      });
      return;
    }

    dispatch({
      type: AuthActionType.SET_USER_SESSION,
      userSession: userSessionResponse.userSession,
    });
  }

  /**
   * Prompt a user to sign up
   */
  async function signup() {
    dispatch({ type: AuthActionType.INIT });

    const loginResponse = await auth.signup();

    if (loginResponse.type === "error") {
      dispatch({
        type: AuthActionType.ERROR,
        errorMessage: loginResponse.errorMessage,
      });
      return;
    }

    const userSessionResponse = await auth.getUserSession();

    if (userSessionResponse.type === "error") {
      dispatch({
        type: AuthActionType.ERROR,
        errorMessage: userSessionResponse.errorMessage,
      });
      return;
    }

    dispatch({
      type: AuthActionType.SET_USER_SESSION,
      userSession: userSessionResponse.userSession,
    });
  }

  /**
   * Prompt a user to change their password
   */
  async function changePassword() {
    dispatch({ type: AuthActionType.INIT });

    const response = await auth.changePassword();

    if (response.type === "error") {
      dispatch({
        type: AuthActionType.ERROR,
        errorMessage: response.errorMessage,
      });
      return;
    }

    dispatch({ type: AuthActionType.CHANGE_PASSWORD_SUCCESS });
  }

  /**
   * Logout a user
   */
  async function logout() {
    dispatch({ type: AuthActionType.INIT });

    const response = await auth.logout();

    if (response.type === "error") {
      dispatch({
        type: AuthActionType.ERROR,
        errorMessage: response.errorMessage,
      });
      return;
    }

    dispatch({ type: AuthActionType.CLEAR_USER_SESSION });
  }

  const authContext: AuthContextType = {
    login,
    signup,
    logout,
    changePassword,
    userSession: state.userSession,
    error: state.error,
    isLoading: state.isLoading,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}
