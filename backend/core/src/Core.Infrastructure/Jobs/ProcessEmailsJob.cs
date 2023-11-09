// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Repositories;
using Core.Infrastructure.Nexus;
using Microsoft.Extensions.Logging;
using Quartz;
using System.Net.Http.Json;

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

        public ProcessEmailsJob(HttpClient client,
            ILogger<ProcessEmailsJob> logger,
            IMailsRepository mailsRepository,
            ICustomerRepository customerRepository,
            ITransactionRepository transactionRepository,
            IUnitOfWork unitOfWork)
        {
            _client = client;
            _logger = logger;
            _mailsRepository = mailsRepository;
            _customerRepository = customerRepository;
            _transactionRepository = transactionRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var mails = _mailsRepository.GetMailsAsync(MailStatus.ReadyToSend.ToString(), context.CancellationToken).Result;

            if (mails.Any())
            {
                // Integrate sendgrid to send emails
                foreach (var mail in mails)
                {
                    // call customer repo for customer name
                    string customerName = string.Empty;
                    var customerCode = mail.References.CustomerCode;

                    var customer = await _customerRepository.GetAsync(customerCode, context.CancellationToken);

                    

                    if (customer != null)
                    {
                        customerName = customer.GetName();
                    }

                    // call transaction repo for tx details
                    var transaction = await _transactionRepository.GetByCodeAsync(mail.References.TransactionCode, context.CancellationToken);




                    // call mail service also pass customerName, tx amount


                    //// Check the MailType before sending email
                    //// For Payout, the MailType should be TransactionSellFinish
                    //if (mail.Type == MailType.TransactionSellFinish.ToString())
                    //{
                    //    // This is for Payout, so use payout template on sendgrid
                    //}
                }
            }




            //if (callbacks.Any())
            //{
            //    _logger.LogInformation("Sending callbacks");

            //    foreach (var callback in callbacks)
            //    {
            //        var body = new
            //        {
            //            callback.Code,
            //            callback.Content,
            //            CreatedOn = DateTimeProvider.ToUnixTimeInMilliseconds(callback.CreatedOn),
            //            Type = callback.Type.ToString()
            //        };

            //        try
            //        {
            //            var response = await _client.PostAsJsonAsync(callback.DestinationUrl, body);

            //            if (response.IsSuccessStatusCode)
            //            {
            //                callback.Sent();
            //            }
            //            else
            //            {
            //                callback.Failed();
            //            }
            //        }
            //        catch (Exception ex)
            //        {
            //            _logger.LogError("An error occured sending callback {code} with message {message}", callback.Code, ex.Message);
            //            callback.Failed();
            //        }


            //        _callbackRepository.Update(callback);
            //    }

                await _unitOfWork.SaveChangesAsync();
            }
        }
    }

