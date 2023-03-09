// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CameraType } from "expo-camera";
import { Button, Heading, Icon, Text, VStack } from "native-base";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useCustomer } from "../api/customer/customer";
import { useTrustLevels } from "../api/labelpartner/trustlevels";
import CustomerLimitsProgress from "../components/CustomerLimitsProgress";
import FullScreenMessage from "../components/FullScreenMessage";
import Notification from "../components/Notification";
import ScreenWrapper from "../components/ScreenWrapper";
import SupportModal from "../components/SupportModal";
import TierOverview, { ITierStatus } from "../components/TierOverview";
import { UpgradeAccountStackParamList } from "../navigation/UpgradeAccountStack";
import SecurityCentreOverviewSkeleton from "./skeletons/SecurityCentreOverviewSkeleton";

type SecurityCentreProps = NativeStackScreenProps<
  UpgradeAccountStackParamList,
  "TiersOverview"
>;

function SecurityCentreOverview({ navigation }: SecurityCentreProps) {
  const [showSupportModal, setShowSupportModal] = useState(false);

  const { status: customerStatus, data: customer } = useCustomer();
  const { status: trustlevelsStatus, data: trustLevels } = useTrustLevels();

  if (customerStatus === "error" || trustlevelsStatus === "error") {
    return (
      <VStack w="full" h="full" justifyContent="center" alignItems="center">
        <FullScreenMessage message="Please try again later" title="Error" />
      </VStack>
    );
  }

  if (customerStatus === "loading" || trustlevelsStatus === "loading") {
    return <SecurityCentreOverviewSkeleton />;
  }

  // TODO after customer custom data is added to API
  // - pending
  // if customer custom data for passport and selfie is true AND trustlevel !== TIER2, show pending

  const { isBusiness, data, trustLevel } = customer.data.value;

  const idCheckPending =
    (data.IdFront != null && data.IdBack != null) || data.Passport != null;
  const selfieCheckPending = data.Selfie != null;
  const tierCodes = Object.keys(trustLevels.value);

  return (
    <ScreenWrapper p={-4} accessibilityLabel="upgrade account overview">
      <ScrollView>
        <CustomerLimitsProgress
          label="Monthly funding limit"
          operationType="funding"
        />
        <CustomerLimitsProgress
          label="Monthly withdraw limit"
          operationType="withdraw"
        />
        <VStack p={4}>
          {idCheckPending &&
            selfieCheckPending &&
            trustLevel.toLocaleLowerCase() ===
              tierCodes[0].toLocaleLowerCase() && (
              <VStack mb={4}>
                <Notification
                  title="Verification in progress"
                  message="Our operators are checking your uploaded documents. Please come back later to check your account tier update."
                  variant="info"
                />
              </VStack>
            )}
          <TierOverview
            isCurrent={
              trustLevel.toLowerCase() ===
              trustLevels.value.Tier1.name.toLowerCase()
            }
            description={
              !isBusiness ? ["Name", "date of birth", "Country"] : undefined
            }
            fundingLimit={trustLevels.value.Tier1.limits.funding.monthly}
            withdrawLimit={trustLevels.value.Tier1.limits.withdraw.monthly}
            heading={trustLevels.value.Tier1.name}
            tierStatus={ITierStatus.Active}
          />
          <TierOverview
            isCurrent={
              trustLevel.toLowerCase() ===
              trustLevels.value.Tier2.name.toLowerCase()
            }
            description={!isBusiness ? ["ID", "Selfie with ID"] : undefined}
            fundingLimit={trustLevels.value.Tier2.limits.funding.monthly}
            withdrawLimit={trustLevels.value.Tier2.limits.withdraw.monthly}
            heading={trustLevels.value.Tier2.name}
            tierStatus={
              trustLevel.toLocaleLowerCase() ===
                trustLevels.value.Tier2.name.toLocaleLowerCase() ||
              trustLevel.toLocaleLowerCase() ===
                trustLevels.value.Tier3.name.toLocaleLowerCase()
                ? ITierStatus.Active
                : ITierStatus.Inactive
            }
            tierUpgradeActions={
              isBusiness ? (
                <Button
                  variant="outline"
                  startIcon={
                    <Icon as={Ionicons} name="help-circle" size="md" />
                  }
                  onPress={handleOpenSupportModal}
                >
                  Contact support
                </Button>
              ) : (
                <VStack space={2}>
                  <Button
                    isDisabled={idCheckPending}
                    variant="outline"
                    bg={idCheckPending ? "warning.100" : "white"}
                    borderColor={idCheckPending ? "warning.600" : "primary.500"}
                    startIcon={
                      <Icon
                        as={FontAwesome5}
                        name={idCheckPending ? "clock" : "upload"}
                        color={idCheckPending ? "warning.600" : "primary.500"}
                      />
                    }
                    size="md"
                    accessibilityLabel="passport/id photo"
                    onPress={() =>
                      navigation.navigate("DocumentUploadOptions", {
                        screenTitle: "Passport/ID",
                        description:
                          "Make sure that the document is clearly readable and there are no glares in the photo.",
                      })
                    }
                  >
                    Add passport or ID
                  </Button>
                  <Button
                    isDisabled={selfieCheckPending}
                    variant="outline"
                    bg={selfieCheckPending ? "warning.100" : "white"}
                    borderColor={
                      selfieCheckPending ? "warning.600" : "primary.500"
                    }
                    startIcon={
                      <Icon
                        as={FontAwesome5}
                        name={selfieCheckPending ? "clock" : "camera"}
                        color={
                          selfieCheckPending ? "warning.600" : "primary.500"
                        }
                      />
                    }
                    accessibilityLabel="selfie"
                    onPress={() =>
                      navigation.navigate("TakePhoto", {
                        screenTitle: "Selfie with ID",
                        document: { type: "selfie" },
                        instructions: (
                          <VStack space={4} alignItems="center">
                            <Heading size="xl" color="white" fontWeight="bold">
                              Selfie with ID
                            </Heading>
                            <VStack space={2}>
                              <Text fontSize="md" color="white">
                                - Please hold the ID document you previously
                                submitted next to your face. We need to verify
                                it is the same document and that the photo
                                matches your face
                              </Text>
                              <Text fontSize="md" color="white">
                                - Your face should face the screen directly
                              </Text>
                              <Text fontSize="md" color="white">
                                - Remove glasses if you wear any
                              </Text>
                            </VStack>
                          </VStack>
                        ),
                        options: {
                          initialCamera: CameraType.front,
                        },
                      })
                    }
                  >
                    Take a selfie
                  </Button>
                </VStack>
              )
            }
          />
          <TierOverview
            isCurrent={
              trustLevel.toLowerCase() ===
              trustLevels.value.Tier3.name.toLowerCase()
            }
            description={
              !isBusiness
                ? ["Proof of wealth", "Proof of residence"]
                : undefined
            }
            fundingLimit={trustLevels.value.Tier3.limits.funding.monthly}
            withdrawLimit={trustLevels.value.Tier3.limits.withdraw.monthly}
            heading={trustLevels.value.Tier3.name}
            tierStatus={
              trustLevel.toLocaleLowerCase() ===
              trustLevels.value.Tier3.name.toLocaleLowerCase()
                ? ITierStatus.Active
                : trustLevel.toLocaleLowerCase() ===
                  trustLevels.value.Tier2.name.toLocaleLowerCase()
                ? ITierStatus.Inactive
                : ITierStatus.Disabled
            }
            tierUpgradeActions={
              <Button
                variant="outline"
                startIcon={<Icon as={Ionicons} name="help-circle" size="lg" />}
                onPress={handleOpenSupportModal}
              >
                Contact support
              </Button>
            }
          />
        </VStack>
      </ScrollView>
      <SupportModal open={showSupportModal} setOpen={setShowSupportModal} />
    </ScreenWrapper>
  );

  function handleOpenSupportModal() {
    setShowSupportModal(true);
  }
}

export default SecurityCentreOverview;
