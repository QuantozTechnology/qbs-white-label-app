// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Abstractions;
using Core.Domain.Entities.CustomerAggregate;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands.CustomerCommands
{
    public class DeviceAuthenticationCommand : IRequest<DeviceAuthentication>
    {
        public required string CustomerCode { get; set; }

        public required string PublicKey { get; set; }

        public string? OTPCode { get; set; }

        public required string IP { get; set; }
    }

    public class DeviceAuthenticationCommandHandler : IRequestHandler<DeviceAuthenticationCommand, DeviceAuthentication>
    {
        private readonly ICustomerDeviceRepository _customerDeviceRepository;
        private readonly ICustomerOTPGenerator _otpGenerator;
        private readonly IUnitOfWork _unitOfWork;

        public DeviceAuthenticationCommandHandler(
            ICustomerDeviceRepository customerDeviceRepository,
            ICustomerOTPGenerator otpGenerator,
            IUnitOfWork unitOfWork)
        {
            _customerDeviceRepository = customerDeviceRepository;
            _otpGenerator = otpGenerator;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeviceAuthentication> Handle(DeviceAuthenticationCommand request, CancellationToken cancellationToken)
        {
            var otpKey = string.Empty;

            var customerDevice = await _customerDeviceRepository.GetAsync(request.CustomerCode, cancellationToken);

            // If the customer does not exist, create a new customer device
            if (customerDevice is null)
            {
                // Customer does not exist, create a new customer device
                otpKey = await CreateNewCustomerDevice(request);
            }
            // If the OTPCode is not empty, verify and process the OTPCode
            else if (!string.IsNullOrWhiteSpace(request.OTPCode))
            {
                otpKey = await VerifyAndProcessOTPCode(request, customerDevice);
            }
            // if the OTPCode is empty and the customer has a public key, then the customer is already verified
            else if (string.IsNullOrWhiteSpace(request.OTPCode) && !CustomerHasPublicKey(customerDevice, request.PublicKey))
            {
                // Customer has a public key but no OTPCode, throw an error
                // This should start the OTP validation process client-side
                throw new CustomErrorsException(DomainErrorCode.ExistingKeyError.ToString(), request.CustomerCode, "Verification needed.");
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new DeviceAuthentication { OTPKey = otpKey };
        }

        private async Task<string> VerifyAndProcessOTPCode(DeviceAuthenticationCommand request, CustomerOTPKeyStore customerDevice)
        {
            string otpKey = customerDevice.OTPKey;

            // Verify the OTPCode against the OTPKey
            var result = _otpGenerator.VerifyOTP(otpKey, request.OTPCode!);

            if (!result)
            {
                throw new CustomErrorsException(DomainErrorCode.SecurityCheckError.ToString(), request.CustomerCode, "OTP code verification failed.");
            }

            // Append the publicKey to the existing list
            customerDevice.PublicKeys.Add(CustomerDevicePublicKeys.NewCustomerDevicePublicKey(request.PublicKey, customerDevice.Id));

            if (string.IsNullOrWhiteSpace(customerDevice.OTPKey))
            {
                // Generate a new OTPKey if none exists
                otpKey = await _otpGenerator.GenerateNewOTPKey();
                customerDevice.OTPKey = otpKey;
            }

            _customerDeviceRepository.Update(customerDevice);

            return otpKey;
        }

        private async Task<string> CreateNewCustomerDevice(DeviceAuthenticationCommand request)
        {
            string otpKey = await _otpGenerator.GenerateNewOTPKey();

            // Create a new customer OTP key store and associated device
            var newDevice = CustomerOTPKeyStore.New(request.CustomerCode, otpKey, request.PublicKey);

            // Add the new customer OTP key store and device to the repository
            _customerDeviceRepository.Add(newDevice);

            return otpKey;
        }

        private static bool CustomerHasPublicKey(CustomerOTPKeyStore customerDevice, string publicKey)
        {
            return customerDevice.PublicKeys.Any(pk => pk.PublicKey == publicKey);
        }
    }
}
