// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Nexus.Sdk.Shared.Requests;
using Nexus.Sdk.Shared.Responses;
using Nexus.Sdk.Token.Responses;

namespace Core.InfrastructureTests.Helpers
{
    public class NexusSDKHelper
    {
        public const string DefaultPublicKey = "GCTI7Y2AXEU4G5QKD4O73N5QCYELAX4VWBCYKA46OEZH5XUJJLWSJYMY";

        public static PagedResponse<T> PagedResponse<T>(IEnumerable<T> list)
        {
            return new PagedResponse<T>(1, list.Count(), 1, new Dictionary<string, string>(), list);
        }

        public static PagedResponse<T> EmptyPagedResponse<T>()
        {
            return new PagedResponse<T>(0, 0, 0, new Dictionary<string, string>(), Array.Empty<T>());
        }

        public static CustomerResponse PrivateCustomer(string customerCode)
        {
            return new CustomerResponse(customerCode, "FirstName", "LastName", "2020-12-12", "123456", null, "PTrusted", "EUR", "NL", "test@email.com", "ACTIVE", "TestBankAccount", false, "Low", new Dictionary<string, string>());
        }

        public static CustomerResponse DeletedPrivateCustomer(string customerCode)
        {
            return new CustomerResponse(customerCode, "FirstName", "LastName", "2020-12-12", "123456", null, "PTrusted", "EUR", "NL", "test@email.com", "DELETED", "TestBankAccount", false, "Low", new Dictionary<string, string>());
        }

        public static IDictionary<string, string> AccountQuery(string customerCode)
        {
            return new Dictionary<string, string>()
            {
                { "customerCode", customerCode },
                { "status", "ACTIVE" }
            };
        }

        public static AccountResponse AccountResponse(string customerCode)
        {
            return new AccountResponse(customerCode, "WOGD7UIC", "XLM", DefaultPublicKey, "ACTIVE");
        }

        public static SignableResponse SignableResponse()
        {
            var response = new BlockchainResponse(
                "TestHash",
                "EncodedEnvelope",
                new RequiredSignaturesResponse[]
                {
                    new RequiredSignaturesResponse("c1cdb46f894dfc80e50efeb27727517f3227303e4ef9ea83d2f1b3b250a91317",
                    "AAAAAgAAAACN5Y0YBD6bCPzSRzpJt6ZbEkQEKJXzaiE1h8ayIbnOjgBMS0AAAUhyAAAAGwAAAAAAAAAAAAAABQAAAAEAAAAAjeWNGAQ+mwj80kc6SbemWxJEBCiV82ohNYfGsiG5zo4AAAAAAAAAABvC06B170rV0q+i7svuTL0JdIVfuMt0eSWe7OXQgSkwAAAAAAExLQAAAAABAAAAABvC06B170rV0q+i7svuTL0JdIVfuMt0eSWe7OXQgSkwAAAABgAAAAI5OGMxYzc1NgAAAAAAAAAAcjHJmVw1cnxWiB+Ip6yft9txmoVd160+Bx221MHSqSd//////////wAAAAEAAAAAcjHJmVw1cnxWiB+Ip6yft9txmoVd160+Bx221MHSqScAAAAVAAAAABvC06B170rV0q+i7svuTL0JdIVfuMt0eSWe7OXQgSkwAAAAAjk4YzFjNzU2AAAAAAAAAAByMcmZXDVyfFaIH4inrJ+323GahV3XrT4HHbbUwdKpJwAAAAAAAAABAAAAAQAAAAAbwtOgde9K1dKvou7L7ky9CXSFX7jLdHklnuzl0IEpMAAAAAYAAAACNmMzN2E2MTUAAAAAAAAAAHW+Oaaa8Gw0gaFzg6bpf24PMDQCippaxMGLaHB0Wq5pf/////////8AAAABAAAAAHW+Oaaa8Gw0gaFzg6bpf24PMDQCippaxMGLaHB0Wq5pAAAAFQAAAAAbwtOgde9K1dKvou7L7ky9CXSFX7jLdHklnuzl0IEpMAAAAAI2YzM3YTYxNQAAAAAAAAAAdb45pprwbDSBoXODpul/bg8wNAKKmlrEwYtocHRarmkAAAAAAAAAAQAAAAAAAAADIbnOjgAAAEAy9d9mWNtOwjAgWSatW4dmnK6z5AQKYiDGDYMAP0PYQ55XsPXKyR8aIO775L7EFR4oFubsPwlCS/OKUeburYMLwdKpJwAAAEATt/zrgkHcp4bwxJipQtcP2rTSV7JT51xMW6lXsyeN9NTIYgDdCdHQ8nqmjT45Qp5Y9ysfTo6x/EtNhp76LcMDdFquaQAAAEBlUa5rw7eHt73DRsYZLCeCcjl0MEYrDad8r6ALrZ+x8h/a8SGQO5MqEv/rqg6RkHYBSO+Sx55AcAe58E7tIF8D",
                    DefaultPublicKey )
                });

            return new SignableResponse
            {
                BlockchainResponse = response
            };
        }

        public static AccountBalancesResponse AccountBalancesResponse()
        {
            var balances = new AccountBalance[] { new AccountBalance("SCEUR", 100, true) };
            return new AccountBalancesResponse(balances);
        }

        public static bool AreEqual(CreateCustomerRequest request1, CreateCustomerRequest request2)
        {
            return request1.IsBusiness == request2.IsBusiness
                && request1.CustomerCode == request2.CustomerCode
                && request1.Status == request2.Status
                && request1.TrustLevel == request2.TrustLevel
                && request1.CurrencyCode == request2.CurrencyCode
                && request1.Email == request2.Email
                && AreEqual(request1.Data, request2.Data);
        }

        private static bool AreEqual<K, V>(IDictionary<K, V>? dict1, IDictionary<K, V>? dict2)
        {
            if (dict1 == null && dict2 != null)
            {
                return false;
            }

            if (dict1 != null && dict2 == null)
            {
                return false;
            }

            if (dict1 == null && dict2 == null)
            {
                return true;
            }

            bool equal = false;

            if (dict1!.Count == dict2!.Count) // Require equal count.
            {
                equal = true;
                foreach (var pair in dict1)
                {
                    if (dict2.TryGetValue(pair.Key, out V? value))
                    {
                        if (value != null)
                        {
                            // Require value be equal.
                            if (!value.Equals(pair.Value))
                            {
                                equal = false;
                                break;
                            }
                        }
                    }
                    else
                    {
                        // Require key be present.
                        equal = false;
                        break;
                    }
                }
            }

            return equal;
        }
    }
}
