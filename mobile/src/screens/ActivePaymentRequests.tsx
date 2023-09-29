// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { PaymentRequestsTabParamList } from "../navigation/PaymentRequestsTab";
import PaymentRequestsList from "../components/PaymentRequestsList";

type Props = MaterialTopTabScreenProps<PaymentRequestsTabParamList, "Active">;

function ActivePaymentRequests(props: Props) {
  return <PaymentRequestsList {...props} type="open" />;
}

export default ActivePaymentRequests;
