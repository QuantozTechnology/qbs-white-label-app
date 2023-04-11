import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { PaymentRequestsTabParamList } from "../navigation/PaymentRequestsTab";
import PaymentRequestsList from "../components/PaymentRequestsList";

type Props = MaterialTopTabScreenProps<PaymentRequestsTabParamList, "Expired">;

function ExpiredPaymentRequests(props: Props) {
  return <PaymentRequestsList {...props} type="expired" />;
}

export default ExpiredPaymentRequests;
