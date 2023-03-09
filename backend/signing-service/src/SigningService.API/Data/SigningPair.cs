// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System;

namespace SigningService.API.Data;

public class SigningPair
{
    public int Id { get; set; }
    public string PublicKey { get; set; }
    public DateTime CreatedOn { get; set; }
    public int? Index { get; set; }
    public string CryptoCode { get; set; }
    public string LabelPartnerCode { get; set; }
}
