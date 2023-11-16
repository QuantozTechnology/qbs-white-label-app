// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain.Abstractions;
using Core.Domain.Exceptions;
using Core.Domain.Repositories;
using Core.Infrastructure.Nexus;
using Microsoft.Extensions.Logging;
using Quartz;

namespace Core.Infrastructure.Jobs
{
    public class ProcessEmailsJob : IJob
    {
        private readonly HttpClient _client;
        private readonly ILogger<ProcessEmailsJob> _logger;
        private readonly IMailsRepository _mailsRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISendGridMailService _sendGridMailService;

        public ProcessEmailsJob(HttpClient client,
            ILogger<ProcessEmailsJob> logger,
            IMailsRepository mailsRepository,
            ICustomerRepository customerRepository,
            ITransactionRepository transactionRepository,
            ISendGridMailService sendGridMailService,
            IUnitOfWork unitOfWork)
        {
            _client = client;
            _logger = logger;
            _mailsRepository = mailsRepository;
            _customerRepository = customerRepository;
            _transactionRepository = transactionRepository;
            _sendGridMailService = sendGridMailService;
            _unitOfWork = unitOfWork;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var mails = _mailsRepository.GetMailsAsync(MailStatus.ReadyToSend.ToString(), context.CancellationToken).Result;

            if (mails.Any())
            {
                foreach (var mail in mails)
                {
                    var customerCode = mail.References?.CustomerCode;

                    if (string.IsNullOrWhiteSpace(customerCode))
                    {
                        throw new CustomErrorsException("MailService", "customerCode", "An error occured while sending mail.");
                    }

                    var customer = await _customerRepository.GetAsync(customerCode, context.CancellationToken);

                    if (mail.References == null || string.IsNullOrWhiteSpace(mail.References.TransactionCode))
                    {
                        throw new CustomErrorsException("MailService", "transactionCode", "An error occured while sending mail.");
                    }

                    var transaction = await _transactionRepository.GetByCodeAsync(mail.References.TransactionCode, context.CancellationToken);

                    decimal amount = 0;

                    if (transaction != null)
                    {
                        amount = transaction.Amount;
                    }

                    try
                    {
                        await _sendGridMailService.SendMailAsync(mail, customer, amount);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("An error occured sending email {code} with message {message}", mail.Code, ex.Message);
                    }

                    // once email has been sent, call nexus to update the status of this mail to 'Sent'
                    await _mailsRepository.UpdateMailSent(mail.Code);
                }
            }

            await _unitOfWork.SaveChangesAsync();
        }
    }
}

