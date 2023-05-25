// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Toast, VStack } from "native-base";
import { createOffer } from "../api/offers/offers";
import GenericListItem from "../components/GenericListItem";
import ScreenWrapper from "../components/ScreenWrapper";
import { OffersStackParamList } from "../navigation/OffersStack";
import { displayFiatAmount } from "../utils/currencies";
import Notification from "../components/Notification";
import { AxiosError } from "axios";
import ReviewOfferAmount from "../components/ReviewOfferAmount";

type ReviewCreatedOfferProps = NativeStackScreenProps<
  OffersStackParamList,
  "ReviewCreatedOffer"
>;

function ReviewCreatedOffer({ navigation, route }: ReviewCreatedOfferProps) {
  const { action, sourceToken, destinationToken, options } = route.params.offer;

  const queryClient = useQueryClient();
  const { mutate: createNewOffer, isLoading: isCreatingOffer } = useMutation({
    mutationFn: createOffer,
    onSuccess() {
      Toast.show({
        render: () => (
          <Notification
            message="Offer created successfully"
            variant="success"
            isToastNotification
          />
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["offers"],
        refetchType: "all",
      });

      const parentNavigation = navigation.getParent();
      const parentState = navigation.getParent()?.getState();

      if (parentState?.routeNames.includes("Portfolio")) {
        parentNavigation?.reset({
          index: 0,
          routes: [
            {
              name: "Portfolio",
            },
          ],
        });
      } else {
        parentNavigation?.reset({
          index: 0,
          routes: [
            {
              name: "OffersList",
            },
          ],
        });
      }
    },
    onError(error) {
      Toast.show({
        render: () => (
          <Notification
            message={
              error instanceof AxiosError
                ? error.response?.data.Errors[0].Message
                : error
            }
            variant="error"
            isToastNotification
          />
        ),
      });
    },
  });

  // TODO use the actual fee, doing this because it's still being discussed
  const isBuyOffer = action === "Buy";
  const fee = isBuyOffer ? 0.8 : -0.8;

  return (
    <ScreenWrapper flex={1}>
      <VStack flex={1} space={4}>
        <ReviewOfferAmount
          action={action}
          destinationToken={destinationToken}
          sourceToken={sourceToken}
          options={options}
        />
        <GenericListItem
          accessibilityLabel="price"
          leftContent="Price"
          rightContent={`${displayFiatAmount(
            sourceToken.amount / destinationToken.amount
          )} ${sourceToken.tokenCode}/${destinationToken.tokenCode}`}
        />
        <GenericListItem
          accessibilityLabel="gross total"
          leftContent={isBuyOffer ? "Purchase" : "Selling"}
          rightContent={displayFiatAmount(sourceToken.amount, {
            currency: sourceToken.tokenCode,
          })}
        />
        <GenericListItem
          accessibilityLabel="fee"
          leftContent="Fee"
          rightContent={displayFiatAmount(fee, {
            currency: isBuyOffer
              ? sourceToken.tokenCode
              : destinationToken.tokenCode,
          })}
        />
        <GenericListItem
          accessibilityLabel="net total"
          leftContent="Total"
          rightContent={displayFiatAmount(sourceToken.amount + fee, {
            currency: sourceToken.tokenCode,
          })}
          bold
        />
      </VStack>
      <Button
        accessibilityLabel="create offer"
        onPress={handleConfirmPress}
        isDisabled={isCreatingOffer}
        isLoading={isCreatingOffer}
        isLoadingText="Creating offer..."
      >
        Confirm
      </Button>
    </ScreenWrapper>
  );

  function handleConfirmPress() {
    createNewOffer(route.params.offer);
  }
}

export default ReviewCreatedOffer;
