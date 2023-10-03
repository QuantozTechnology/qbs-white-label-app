// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";

export const useDeviceHasScreenLock = () => {
  const [hasScreenLockMechanism, setHasScreenLockMechanism] = useState<
    boolean | null
  >(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDeviceSecurityLevel = async () => {
      setIsLoading(true);
      try {
        const result = await LocalAuthentication.getEnrolledLevelAsync();
        setHasScreenLockMechanism(
          result !== LocalAuthentication.SecurityLevel.NONE
        );
      } catch (e) {
        setError({ message: "Error checking device screen lock mechanism" });
      } finally {
        setIsLoading(false);
      }
    };

    checkDeviceSecurityLevel();
  }, []);
  return { hasScreenLockMechanism, error, isLoading };
};
