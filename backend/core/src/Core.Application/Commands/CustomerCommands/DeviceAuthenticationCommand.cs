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
                // Customer does not exist, create a new customer and device
                otpKey = _otpGenerator.GenerateNewOTPKey().Result;

                // Create a new customer OTP key store and associated device
                var newDevice = CustomerOTPKeyStore.New(request.CustomerCode, otpKey, request.PublicKey);

                // Add the new customer OTP key store and device to the repository
                _customerDeviceRepository.Add(newDevice);

                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
            else
            {
                // Customer exists, check if the public key already exists
                if (customerDevice.PublicKeys.Any(pk => pk.PublicKey == request.PublicKey))
                {
                    throw new CustomErrorsException(DomainErrorCode.SecurityCheckError.ToString(), request.CustomerCode, "Public Key already exists.");
                }

                // Append the publicKey to the existing list
                customerDevice.PublicKeys.Add(CustomerDevicePublicKeys.NewCustomerDevicePublicKey(request.PublicKey, customerDevice.Id));

                if (string.IsNullOrWhiteSpace(customerDevice.OTPKey))
                {
                    // Generate a new OTPKey if none exists
                    otpKey = _otpGenerator.GenerateNewOTPKey().Result;
                    customerDevice.OTPKey = otpKey;
                }
                else
                {
                    otpKey = customerDevice.OTPKey;
                }

                _customerDeviceRepository.Update(customerDevice);

                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            if (!string.IsNullOrWhiteSpace(request.OTPCode))
            {
                // Verify the OTPCode against the OTPKey
                var result = _otpGenerator.VerifyOTP(otpKey, request.OTPCode);

                if (!result)
                {
                    throw new CustomErrorsException(DomainErrorCode.SecurityCheckError.ToString(), request.CustomerCode, "OTP code verification failed.");
                }
            }

            return new DeviceAuthentication { OTPKey = otpKey };
        }
    }
}
