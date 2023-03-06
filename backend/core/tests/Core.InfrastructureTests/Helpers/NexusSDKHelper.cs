using Nexus.SDK.Shared.Requests;
using Nexus.SDK.Shared.Responses;
using Nexus.Token.SDK.Responses;

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
            return new CustomerResponse(customerCode, "PTrusted", "EUR", "test@test.com", "ACTIVE", "TestBankAccount", false, new Dictionary<string, string>());
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
            var response = new BlockchainResponse("TestHash", "EncodedEnvelope", Array.Empty<AlgorandTransactionResponse>());
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

        public static bool AreEqual(CustomerRequest request1, CustomerRequest request2)
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
