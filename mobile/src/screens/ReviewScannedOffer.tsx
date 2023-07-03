// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button, Toast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { APIError } from "../api/generic/error.interface";
import { confirmOffer, useOffer } from "../api/offers/offers";
import FullScreenMessage from "../components/FullScreenMessage";
import GenericListItem from "../components/GenericListItem";
import Notification from "../components/Notification";
import ReviewOfferAmount from "../components/ReviewOfferAmount";
import ScreenWrapper from "../components/ScreenWrapper";
import { OffersStackParamList } from "../navigation/OffersStack";
import { displayFiatAmount, getDecimalCount } from "../utils/currencies";
import { formatError } from "../utils/errors";
import { calculatePrice } from "../utils/offers";
import ReviewScannedOfferSkeleton from "./skeletons/ReviewScannedOfferSkeleton";

type Props = NativeStackScreenProps<OffersStackParamList, "ReviewScannedOffer">;

function ReviewScannedOffer({ navigation, route }: Props) {
  const queryClient = useQueryClient();

  const { data, status } = useOffer({ offerCode: route.params.code });
  const { mutate, isLoading } = useMutation({
    mutationFn: confirmOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        refetchType: "all",
      });

      navigation.popToTop();

      Toast.show({
        render: () => (
          <Notification
            title="Offer confirmed"
            message="Bought this much"
            variant="success"
            isToastNotification
          />
        ),
      });
    },
    onError: (error: AxiosError<APIError>) => {
      Toast.show({
        render: () => (
          <Notification
            message={formatError(error)}
            title="Error"
            variant="error"
            isToastNotification
          />
        ),
      });
    },
  });

  const [customAmount, setCustomAmount] = useState<string | undefined>(
    data?.value.destinationToken.totalAmount
  );

  useEffect(() => {
    if (data && !customAmount) {
      setCustomAmount(data.value.destinationToken.totalAmount);
    }
  }, [data]);

  if (status === "error") {
    return <FullScreenMessage message="Error loading the offer" />;
  }

  if (status === "loading" || customAmount == null) {
    // return <FullScreenLoadingSpinner />;
    return <ReviewScannedOfferSkeleton />;
  }

  const { action, customerCode, offerCode, sourceToken, destinationToken } =
    data.value;

  const isBuyOffer = action === "Buy";
  const price = calculatePrice(action, sourceToken, destinationToken);
  // TODO update with values from API
  const fee = "0.80";
  const maxAmount = "500.00";

  const customAmountIsValid = parseFloat(customAmount) <= parseFloat(maxAmount);

  return (
    <ScreenWrapper flex={1} justifyContent="space-between">
      <VStack space={2}>
        <ReviewOfferAmount
          offer={data.value}
          maxAmount={maxAmount}
          customAmount={customAmount}
          setCustomAmount={setCustomAmount}
        />
        <GenericListItem
          leftContent={isBuyOffer ? "Seller" : "Buyer"}
          rightContent={customerCode}
        />
        <GenericListItem
          leftContent="Price"
          rightContent={`${price} ${
            isBuyOffer ? sourceToken.tokenCode : destinationToken.tokenCode
          }/${isBuyOffer ? destinationToken.tokenCode : sourceToken.tokenCode}`}
        />
        <GenericListItem
          leftContent={isBuyOffer ? "Purchase value" : "Sell value"}
          rightContent={displayFiatAmount(
            isBuyOffer
              ? parseFloat(customAmount) * parseFloat(price.split(" ")[0])
              : parseFloat(customAmount) * parseFloat(price.split(" ")[0]),
            {
              currency: isBuyOffer
                ? sourceToken.tokenCode
                : destinationToken.tokenCode,
              decimals: isBuyOffer
                ? getDecimalCount(sourceToken.totalAmount)
                : getDecimalCount(destinationToken.totalAmount),
            }
          )}
        />
        <GenericListItem
          leftContent="Fee"
          rightContent={displayFiatAmount(fee, {
            currency: isBuyOffer
              ? sourceToken.tokenCode
              : destinationToken.tokenCode,
          })}
        />
        <GenericListItem
          accessibilityLabel="total"
          leftContent={isBuyOffer ? "Total to be paid" : "Total to receive"}
          rightContent={displayFiatAmount(
            isBuyOffer
              ? parseFloat(customAmount) * parseFloat(price.split(" ")[0]) +
                  parseFloat(fee)
              : parseFloat(customAmount) * parseFloat(price.split(" ")[0]) -
                  parseFloat(fee),
            {
              currency: isBuyOffer
                ? sourceToken.tokenCode
                : destinationToken.tokenCode,
              decimals: isBuyOffer
                ? getDecimalCount(sourceToken.totalAmount)
                : getDecimalCount(destinationToken.totalAmount),
            }
          )}
          bold
        />
      </VStack>
      <Button
        onPress={handleConfirmOffer}
        isDisabled={!customAmountIsValid || isLoading}
        isLoading={isLoading}
        isLoadingText="Confirming offer..."
      >
        Confirm
      </Button>
    </ScreenWrapper>
  );

  function handleConfirmOffer() {
    mutate({ offerCode, amount: customAmount ?? destinationToken.totalAmount });
  }
}

export default ReviewScannedOffer;
