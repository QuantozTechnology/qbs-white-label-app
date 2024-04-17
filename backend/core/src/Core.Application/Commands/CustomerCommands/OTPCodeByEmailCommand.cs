// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Abstractions;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using MediatR;

namespace Core.Application.Commands.CustomerCommands
{
    public class OTPCodeByEmailCommand : IRequest
    {
        public string CustomerCode { get; set; }

        public string IP { get; set; }

        public OTPCodeByEmailCommand(string customerCode, string ip)
        {
            CustomerCode = customerCode;
            IP = ip;
        }
    }

    public class OTPCodeByEmailCommandHandler : IRequestHandler<OTPCodeByEmailCommand>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ICustomerDeviceRepository _customerDeviceRepository;
        private readonly ICustomerOTPGenerator _otpGenerator;
        private readonly ISendGridMailService _sendGridMailService;
        private readonly IUnitOfWork _unitOfWork;

        public OTPCodeByEmailCommandHandler(
            ICustomerRepository customerRepository,
            ICustomerDeviceRepository customerDeviceRepository,
            ICustomerOTPGenerator otpGenerator,
            ISendGridMailService sendGridMailService,
            IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _customerDeviceRepository = customerDeviceRepository;
            _otpGenerator = otpGenerator;
            _sendGridMailService = sendGridMailService;
            _unitOfWork = unitOfWork;
        }

        public async Task Handle(OTPCodeByEmailCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);

            if (customer == null)
            {
                throw new CustomErrorsException(DomainErrorCode.CustomerNotFoundError.ToString(), request.CustomerCode, "Customer not found.");
            }

            if (customer.Status != CustomerStatus.ACTIVE.ToString())
            {
                throw new CustomErrorsException(DomainErrorCode.CustomerNotActiveError.ToString(), request.CustomerCode, "Customer is not ACTIVE.");
            }

            var customerDevice = await _customerDeviceRepository.GetAsync(request.CustomerCode, cancellationToken);

            // rare case of exception
            if (customerDevice == null || string.IsNullOrEmpty(customerDevice.OTPKey))
            {
                throw new CustomErrorsException(DomainErrorCode.CustomerNotFoundError.ToString(), request.CustomerCode, "Customer device key not found.");
            }

            // Generate OTPCode
            var otpCode = _otpGenerator.GenerateOTPCode(customerDevice.OTPKey);

            // Send OTPCode to customer email
            await _sendGridMailService.SendOTPCodeMailAsync(customer, otpCode);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
