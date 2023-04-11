import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { PaymentRequestsTabParamList } from "../navigation/PaymentRequestsTab";
import PaymentRequestsList from "../components/PaymentRequestsList";

type Props = MaterialTopTabScreenProps<PaymentRequestsTabParamList, "Active">;

function ActivePaymentRequests(props: Props) {
  return <PaymentRequestsList {...props} type="open" />;
}

export default ActivePaymentRequests;
