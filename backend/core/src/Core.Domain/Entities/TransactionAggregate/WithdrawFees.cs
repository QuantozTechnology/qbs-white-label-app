// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Entities.TransactionAggregate
{
    public class WithdrawFees
    {
        public required decimal? RequestedValueFiat { get; set; }

        public required FeeBreakdown Fees;

        public required decimal? ExecutedValueFiat { get; set; }
    }

    public class FeeBreakdown
    {
        public decimal? BankFeeFiat { get; set; }

        public decimal? ServiceFeeFiat { get; set; }
    }
}
