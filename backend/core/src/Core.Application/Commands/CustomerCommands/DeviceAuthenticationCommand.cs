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

            if (customerDevice is null)
            {
                // Customer does not exist, create a new customer device
                otpKey = CreateNewCustomerDevice(request);
            }
            else if (!string.IsNullOrWhiteSpace(request.OTPCode))
            {
                otpKey = VerifyAndProcessOTPCode(request, customerDevice);
            }
            else if (string.IsNullOrWhiteSpace(request.OTPCode) && !CustomerHasPublicKey(customerDevice, request.PublicKey))
            {
                throw new CustomErrorsException(DomainErrorCode.ExistingKeyError.ToString(), request.CustomerCode, "Verfication needed.");
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new DeviceAuthentication { OTPKey = otpKey };
        }

        private string VerifyAndProcessOTPCode(DeviceAuthenticationCommand request, CustomerOTPKeyStore customerDevice)
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
                otpKey = _otpGenerator.GenerateNewOTPKey().Result;
                customerDevice.OTPKey = otpKey;
            }

            _customerDeviceRepository.Update(customerDevice);

            return otpKey;
        }

        private string CreateNewCustomerDevice(DeviceAuthenticationCommand request)
        {
            string otpKey = _otpGenerator.GenerateNewOTPKey().Result;

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
