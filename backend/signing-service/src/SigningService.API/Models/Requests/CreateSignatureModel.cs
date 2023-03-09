// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using SigningService.API.Models.Projection;
using stellar_dotnet_sdk;
using System.Collections.Generic;

namespace SigningService.API.Models.Requests;

public class CreateSignatureModel
{
    public string Crypto { get; set; }
    public string LabelPartnerCode { get; set; }
    public IList<SigningPairDTO> SigningPairs { get; set; }

    public string ToBeSignedTransactionEnvelope { get; set; }

    public Network Network { get; set; }
}

public class CreateSignatureRequestModel
{
    public string Crypto { get; set; }
    public string LabelPartnerCode { get; set; }

    /// <summary>
    /// defines the type of the network
    /// </summary>
    /// <example> public || test </example>
    public string NetworkPassphrase { get; set; }

    /// <summary>
    /// list of all signers that need to sign the tx envelope
    /// </summary>
    public IEnumerable<string> Signers { get; set; }
    public string ToBeSignedTransactionEnvelope { get; set; }

    public bool IsFeeBumpTransaction { get; set; } = false;
}
