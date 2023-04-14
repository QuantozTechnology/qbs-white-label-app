# Integrating Payments into your App
<br>
<br>

## Before you start

1. Please make sure you are registered as a Merchant customer. You can register using the Mobile App.
2. Once you have been approved and verified as a merchant, you can copy the Account Code. You can find it under the Account Settings in the Mobile App.
3. Store this Account Code as you would need it to initiate Payment Requests.

<br>

## How it works

1. The merchant app sends a POST request to the API endpoint `/api/paymentRequests/merchant` to create a payment request. The request body contains the following information:

    ```
    CreateMerchantPaymentRequest:
    {
        // Required properties
        TokenCode: string,
        AccountCode: string,
        Amount: decimal,
        MerchantSettings:
        {
            CallbackUrl: string, // URL to receive payment status callbacks
            ReturnUrl: string // URL to redirect user after payment completion
        },

        // Optional properties
        Options:
        {
            ExpiresOn: long, // Timestamp in milliseconds for payment request expiration
            ShareName: bool, // Flag indicating whether to share recipient name with payer
            Memo: string, // Memo for the payment request
            IsOneOffPayment: bool, // Flag indicating whether payment is one-time or recurring
            PayerCanChangeRequestedAmount: bool, // Flag indicating whether payer can change payment amount
            Params: Dictionary<string,string> // Additional parameters for payment request
        }
    }

    Response:
    "value": {
        "merchantSettings": {
            "returnUrl": string,
            "redirectUrl": string
        },
        "callbacks": [],
        "code": string, // unique code
        "tokenCode": string,
        "requestedAmount": decimal,
        "status": enum,
        "createdOn": dateTime,
        "updatedOn": dateTime,
        "options": {
            "expiresOn": long,
            "memo": string,
            "name": string,
            "isOneOffPayment": bool,
            "payerCanChangeRequestedAmount": bool,
            "params": {}
        },
        "payments": []
    }
    ```

2. The API processes the payment request and sends a redirect URL as a response to the merchant app.

3. The merchant app redirects the user to the payment portal using the redirect URL received in step 2.

4. The user scans the QR code and completes the payment.

5. The payment portal redirects the user back to the merchant app using the `ReturnUrl` specified in step 1. To indicate the success or failure of the payment request, the following parameters are appended:
    - `success`: a boolean indicating whether the payment request was successful or not.
    - `reason`: a string containing a message indicating the reason for the success or failure of the payment request.
<br>

6. As a last step, if the payment is successful, the API sends a callback to the `CallbackUrl` specified in step 1. An example of a callback looks as follows:

    ```
    {
      "code": "a3929e5e-cc50-497d-8365-3946fe9cb123",
      "content": "{\"PaymentRequestCode\":\"5d99e701-01b7-42bc-81ba-c6aeeec29dd7\",\"payment\":{\"TransactionCode\":\"1B95B7287F4745F58B4D69F2981BCB0\}",
      "createdOn": 1681462874475,
      "type": "PaymentRequestPaid"
    }
    ```

<br>
<br>

<img src="/paymentrequest.merchant.flow.png" style="max-width: 80%; height: auto;">

