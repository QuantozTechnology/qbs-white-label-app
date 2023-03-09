# QBS White Label App
Welcome to the QBS White Label App repository.

The QBS White Label App is a mobile application that allows users to send and receive payments on the blockchain. This app provides a simple and intuitive interface for customers and merchants to manage their account, send and receive payments, and view their transaction history.

This repository contains the source code which can be customized and branded for use by different businesses and organizations.

## Repository Overview

### [AzureB2C](./azureB2C)
This app supports AzureB2C as its identity provider. To help you get setup easier, we provide some templates and policy files that can be uploaded to your domain for authenticating/authorizating your users. 

In this section you will find guides on how to setup and configure an AzureB2C instance.

### [Backend](./backend/README.md)

<img src="./docs/images/img1.png"  width="100%" height="70%">

The backend provides the following functionality:

1. [Core](./backend/core) - An API service that provides core functionality to the frontend applications. This includes functionality such as customer registration, account creation, payment creation and file uploading.

2. [SigningService](./backend/signing-service) - A service for securely storing the private keys of your customers and signing transactions on their behalf.

3. [Web](./backend/web) - A web application that allows customers and merchants to generate and pay payment requests.<br>

In this section you will find guides on how to build and run the backend APIs.

### [Mobile](./mobile)

The mobile application is available on both IOS and Android. It makes use of the backend API's to execute most of its functionality.

In this section you will find guides on how to build and run the mobile application using Expo.

<div align="center">

<img src="./docs/images/img3.jpg"  width="30%">
<img src="./docs/images/img4.jpg"  width="30%">
<img src="./docs/images/img5.jpg"  width="30%">

</div>

## License

qbs-white-label-app is licensed under an Apache-2.0 license. See the [License](/LICENSE) file for details.