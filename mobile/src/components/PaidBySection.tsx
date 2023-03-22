import { Box, ScrollView, Text, VStack } from "native-base";
import { PaymentRequestPayments } from "../api/paymentrequest/paymentRequest.interface";
import { displayFiatAmount } from "../utils/currencies";
import { formatDate } from "../utils/dates";
import DataDisplayField from "./DataDisplayField";

type Props = {
  tokenCode: string;
  payments: PaymentRequestPayments;
};

function PaidBySection({ tokenCode, payments }: Props) {
  if (payments.length === 0) {
    return (
      <Box mt={3} px={4} py={2} mx="auto" bg="muted.200" rounded="full">
        <Text color="muted.400" accessibilityLabel="no payments">
          Nobody paid yet
        </Text>
      </Box>
    );
  }

  return (
    <VStack mt={3} accessibilityLabel="paid by section">
      <ScrollView>
        {payments.map((p) => (
          <DataDisplayField
            key={p.transactionCode}
            value={p.accountCode ?? "N/A"}
            label={formatDate(p.createdOn)}
            action={
              <Text pr={4} accessibilityLabel="payment paid amount">
                {displayFiatAmount(p.amount, { currency: tokenCode })}
              </Text>
            }
          />
        ))}
      </ScrollView>
    </VStack>
  );
}

export default PaidBySection;
