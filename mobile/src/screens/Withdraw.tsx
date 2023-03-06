import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  Input,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  Toast,
  useDisclose,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useBalances } from "../api/balances/balances";
import { Balances } from "../api/balances/balances.interface";
import { useCustomer } from "../api/customer/customer";
import { APIError } from "../api/generic/error.interface";
import { useCustomerLimits } from "../api/limits/limits";
import { createWithdraw } from "../api/withdraw/withdraw";
import { WithdrawPayload } from "../api/withdraw/withdraw.interface";
import BalancesList from "../components/BalancesList";
import CustomerLimitsProgress from "../components/CustomerLimitsProgress";
import CustomerLimitsProgressError from "../components/CustomerLimitsProgressError";
import CustomerLimitsProgressSkeleton from "../components/CustomerLimitsProgressSkeleton";
import DataDisplayField from "../components/DataDisplayField";
import FormControlSkeleton from "../components/FormControlSkeleton";
import FullScreenMessage from "../components/FullScreenMessage";
import Notification from "../components/Notification";
import ScreenWrapper from "../components/ScreenWrapper";
import TokensSelection from "../components/TokensSelection";
import WithdrawFees from "../components/WithdrawFees";
import { defaultConfig } from "../config/config";
import { PortfolioStackParamList } from "../navigation/PortfolioStack";
import { biometricValidation } from "../utils/biometric";
import { displayFiatAmount } from "../utils/currencies";
import { formatError } from "../utils/errors";
import { getPlatformOS } from "../utils/reactNative";
import { formatAmount } from "../utils/string";
import { validationCheck } from "../utils/validation/errors";

type Props = NativeStackScreenProps<PortfolioStackParamList, "Withdraw">;

function Withdraw({ navigation }: Props) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const queryClient = useQueryClient();

  const [selectedToken, setSelectedToken] = useState<Balances>();
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [showModal, setShowModal] = useState(false);

  const { status: balancesStatus, data: balances } = useBalances();
  const { status: limitsStatus, data: limits } = useCustomerLimits();
  const { data: customer, status: customerStatus } = useCustomer();

  const { mutate: withdraw, isLoading: isWithdrawing } = useMutation({
    mutationFn: createWithdraw,
    onSuccess() {
      // refetch
      queryClient.invalidateQueries({
        queryKey: ["balances"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
        refetchType: "all",
      });

      Toast.show({
        render: () => {
          if (selectedToken) {
            return (
              <Notification
                title="Withdraw successful"
                message={`Withdrew ${displayFiatAmount(parseFloat(amount), {
                  currency: selectedToken.tokenCode,
                })}`}
                variant="success"
              />
            );
          }
        },
        id: "api-error",
      });

      navigation.navigate("Portfolio");
    },
    onError(error) {
      const axiosError = error as AxiosError<APIError>;

      Toast.show({
        render: () => (
          <Notification message={formatError(axiosError)} variant="error" />
        ),
        id: "create-withdraw-error",
      });
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={
            <Icon
              as={Ionicons}
              name="information-circle-outline"
              size="lg"
              onPress={handleInfoButtonPress}
              accessibilityLabel="info button"
            />
          }
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (balances != null && selectedToken == null) {
      setSelectedToken(balances.value[0]);
    }
  }, [balances]);

  if (
    limitsStatus === "error" ||
    balancesStatus === "error" ||
    customerStatus === "error"
  ) {
    return (
      <VStack p={4}>
        <CustomerLimitsProgressError />
        <FullScreenMessage
          message="Please try again later"
          title="Error loading data"
          noFullScreen
        />
      </VStack>
    );
  }

  if (
    limitsStatus === "loading" ||
    balancesStatus === "loading" ||
    customerStatus === "loading" ||
    selectedToken == null
  ) {
    return (
      <VStack p={4} space={4}>
        <CustomerLimitsProgressSkeleton hideDescriptionLines />
        <VStack space={2}>
          <FormControlSkeleton />
          <FormControlSkeleton />
        </VStack>
      </VStack>
    );
  }

  const balanceOfSelectedStablecoin = balances?.value.find(
    ({ tokenCode }) => tokenCode === selectedToken.tokenCode
  )?.balance;
  const sceurToken = limits.value.find(
    ({ tokenCode }) => tokenCode === defaultConfig.defaultStableCoin
  );

  if (balanceOfSelectedStablecoin == null || sceurToken == null) {
    return (
      <FullScreenMessage
        message="Cannot proceed with the withdraw, try again later"
        title="Error"
      />
    );
  }

  const monthlyLimit = parseFloat(limits.value[0].withdraw.limit.monthly);

  const maxAmountAllowed =
    balanceOfSelectedStablecoin > monthlyLimit
      ? balanceOfSelectedStablecoin
      : monthlyLimit;

  const PayloadValidationSchema = z.object({
    amount: z.coerce
      .number()
      .min(defaultConfig.feeSettings.minimumFee, {
        message: `Min: ${displayFiatAmount(
          defaultConfig.feeSettings.minimumFee,
          { currency: selectedToken.tokenCode }
        )}`,
      })
      .max(maxAmountAllowed),
    tokenCode: z.string(),
  });

  const hasReachedLimits =
    sceurToken.withdraw.used.monthly === sceurToken.withdraw.limit.monthly;

  return (
    <ScreenWrapper p={-4} flex={1}>
      <KeyboardAvoidingView
        behavior={getPlatformOS() === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={136}
        flex={1}
      >
        <ScrollView>
          <VStack space={2} flex={1}>
            <CustomerLimitsProgress
              label="Monthly withdraw limits"
              operationType="withdraw"
            />
            {!hasReachedLimits && (
              <VStack px={4}>
                {!customer.data.value.bankAccountNumber ? (
                  <Notification
                    title="No known bank account"
                    message="Fund your account first, before being able to withdraw."
                    variant="warning"
                    actionButton={
                      <Button
                        bg="warning.600"
                        _pressed={{ bg: "warning.700" }}
                        onPress={handleRedirectFunding}
                        py={2}
                      >
                        Fund account
                      </Button>
                    }
                  />
                ) : (
                  <DataDisplayField
                    label="Your bank account"
                    value={customer.data.value.bankAccountNumber}
                  />
                )}
                <Pressable onPress={onOpen}>
                  <BalancesList
                    selectedToken={selectedToken}
                    setSelectedToken={setSelectedToken}
                  />
                </Pressable>
                <FormControl isRequired isInvalid={errors["amount"] != null}>
                  <FormControl.Label>Amount</FormControl.Label>
                  <Input
                    value={amount}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    accessibilityLabel="amount"
                  />
                  <FormControl.ErrorMessage accessibilityLabel="amount error">
                    {errors["amount"]}
                  </FormControl.ErrorMessage>
                </FormControl>
                <TokensSelection
                  isOpen={isOpen}
                  onClose={onClose}
                  selectedToken={selectedToken}
                  setSelectedToken={setSelectedToken}
                  tokens={balances.value}
                />
              </VStack>
            )}
            <WithdrawFees
              tokenCode={
                selectedToken?.tokenCode ?? balances.value[0].tokenCode
              }
              amount={amount}
            />
          </VStack>
        </ScrollView>

        <Box p={4}>
          <Button
            onPress={handleWithdrawRequest}
            isDisabled={
              isWithdrawing ||
              hasReachedLimits ||
              !customer?.data.value.bankAccountNumber
            }
            isLoading={isWithdrawing}
            isLoadingText="Withdrawing..."
            accessibilityLabel="withdraw button"
          >
            Withdraw
          </Button>
        </Box>
      </KeyboardAvoidingView>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header accessibilityLabel="info modal title">
            Withdrawing your funds
          </Modal.Header>
          <Modal.Body>
            <Text accessibilityLabel="info modal text">
              Here we will explain how withdraw works. Also mention that to
              change bank account, they need to contact support. Maybe add a
              button in this modal?
            </Text>
          </Modal.Body>
          <Modal.Footer p={1}>
            <Button
              variant="ghost"
              onPress={() => {
                setShowModal(false);
              }}
              accessibilityLabel="close info modal"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </ScreenWrapper>
  );

  function handleInfoButtonPress() {
    setShowModal(true);
  }

  function handleRedirectFunding() {
    navigation.replace("Funding");
  }

  function handleAmountChange(value: string) {
    setAmount(value);
    if (
      balances != null &&
      limits != null &&
      (value > limits?.value[0].withdraw.limit.monthly ||
        parseFloat(value) > balances?.value[0].balance)
    ) {
      setErrors({
        ...errors,
        amount: "Amount greater than balance or account limits",
      });
    } else {
      setErrors({ ...errors, amount: undefined });
    }
  }

  async function handleWithdrawRequest() {
    if (selectedToken) {
      const payload: WithdrawPayload = {
        amount: formatAmount(amount),
        tokenCode: selectedToken?.tokenCode ?? balances?.value[0].tokenCode,
      };

      const result = validationCheck(PayloadValidationSchema, payload);

      if (result != null) {
        setErrors(result);
      } else {
        const biometricCheck = await biometricValidation();

        if (biometricCheck.result === "success") {
          withdraw(payload);
        } else {
          Toast.show({
            render: () => (
              <Notification
                message="Please complete biometric authentication"
                variant="warning"
                isToastNotification
              />
            ),
          });
        }
      }
    }
  }
}

export default Withdraw;
