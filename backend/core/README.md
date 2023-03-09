## Installation

To run or host the APIn the following is required:

1. <b>AzureB2C</b> instance (You can find the details to set this up [here](../../azureB2C/README.md))
2. <b>Nexus</b> instance (Please get in [contact](https://quantoz.com/contact/) with us to setup a Nexus subscription for you).
3. <b>Signing Service</b> instance (You can find details to set this up [here](../signing-service/README.md))
4. <b>Azure Blob Storage</b> instance (You can find details to set this up [here](https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal))
5. <b>MS SQL Server</b> instance (This can be [locally](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb?view=sql-server-ver16) or [hosted](https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-create-quickstart?view=azuresql&tabs=azure-portal))
6. <b>IPLocator</b> instance (You can find details [here](https://ip-api.com/docs/api:json). There is also a free tier available)

### Example Appsettings.json
```json
{
  "AzureB2COptions": [
    {
      "Issuer": "https://contoso.b2clogin.com/tfp/e13cb639-f18a-4e92-a148-258d11780b50/b2c_1_mobile_signin/v2.0/",
      "Audience": "ad72c362-fc57-4268-b3a5-c761f569e5cd"
    },
    {
      "Issuer": "https://contoso.b2clogin.com/tfp/e13cb639-f18a-4e92-a148-258d11780b50/b2c_1_merchant_signin/v2.0/",
      "Audience": "ad72c362-fc57-4268-b3a5-c761f569e5cd"
    },
    {
      "Issuer": "https://contoso.b2clogin.com/tfp/e13cb639-f18a-4e92-a148-258d11780b50/signup_withphoneverification/v2.0/",
      "Audience": "ad72c362-fc57-4268-b3a5-c761f569e5cd"
    }
  ],
  "NexusOptions": {
    "ApiUrl": "https://testapi.quantoz.com",
    "PaymentMethodOptions": {
      "Payout": "LP_INSTANT_PAYOUT_XLM_EUR" // see https://testdocs.quantoznexus.com/articles/configure-nexus/initial_setup.html#payment-methods for information on payment methods.
    },
    "AuthProviderOptions": { // see https://testdocs.quantoznexus.com/articles/start-developing/sd_authentication.html to setup Nexus authentication.
      "IdentityUrl": "https://testidentity.quantoz.com",
      "ClientId": "FcSHavRaIyksRRYTsIFXNYYYINyaEwyR",
      "ClientSecret": "secret",
      "Scopes": "api1 sanctionlist"
    }
  },
  "TokenOptions": {
    "Blockchain": "STELLAR",
    "CustomerTokens": [ "SCEUR" ]
  },
  "ComplianceOptions": {
    "BlacklistedCountries": "", // comma seperated list of countries
    "MerchantTrustlevels": { // see https://testdocs.quantoznexus.com/articles/knowledge-base/kb_trust_levels.html?q=trustlevels for information on trust levels
      "Tier1": "BTier1",
      "Tier2": "BTier2",
      "Tier3": "BTier3"
    },
    "PrivateTrustlevels": {
      "Tier1": "Tier1",
      "Tier2": "Tier2",
      "Tier3": "Tier3"
    }
  },
  "SanctionlistOptions": {
    "BaseUrl": "https://testsanctionlist.quantoz.com",
    "Sanctionlists": "OFAC,EU,NL",
    "MaximumSanctionlistScore": 8
  },
  "IPLocatorOptions": {
    "BaseUrl": "https://pro.ip-api.com",
    "Key": "" // only required for paid tiers
  },
  "SigningServiceOptions": {
    "BaseUrl": "https://signing-service.azurewebsites.net",
    "CreateSigningPairKey": "create_signing_pair_function_key",
    "CreateSignatureKey": "create_signature_function_key",
    "StellarNetworkPassPhrase": "Public Global Stellar Network ; September 2015"
  },
  "BlobStorageOptions": {
    "StorageConnectionString": "DefaultEndpointsProtocol=https;AccountName=yourstorename;AccountKey=yourstorekey;EndpointSuffix=core.windows.net",
    "ContainerName": "your-container-name"
  },
  "ConnectionStrings": {
    "Database": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=quantoz-payments-db;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;"
  },
  "CORSOptions": { // only required if the API is access by a browser running on a different server. 
    "AllowedOrigins": [],
    "AllowedMethods": []
  },
  "Quartz": {
    "ProcessCallbacksJob": "0/5 * * * * ?"
  },
  // NOTE: all ConfigOptions can be be publically accessed by the user. DO NOT configure any secrets here.
  "ConfigOptions": { // configuration for the Portal running
    "Portal": {
      "AzureAd": {
        "ClientId": "deef8c58-fa77-4703-ad55-982bbebbe85f",
        "Authority": "https://contoso.b2clogin.com/contoso.onmicrosoft.com/B2C_1_merchant_signin",
        "ValidateAuthority": true,
        "DefaultScopes": [ 
            "https://contoso.onmicrosoft.com/70756d5e-ffd2-47a7-ba93-ffa374094c5e/PaymentRequest.Merchant.Create",
            "https://contoso.onmicrosoft.com/70756d5e-ffd2-47a7-ba93-ffa374094c5e/PaymentRequest.Merchant.Read",
            "https://contoso.onmicrosoft.com/70756d5e-ffd2-47a7-ba93-ffa374094c5e/Account.Read"
        ]
      },
      "Deeplinks": {
        "PaymentRequests": "exp://10.8.42.132:19000/--/paymentrequests/{0}" //
      }
    }
  },
  "AllowedHosts": "*"
}
```
