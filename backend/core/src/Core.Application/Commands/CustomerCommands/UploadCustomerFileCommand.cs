// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Domain;
using Core.Domain.Abstractions;
using Core.Domain.Primitives;
using Core.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Core.Application.Commands.CustomerCommands
{
    public class UploadCustomerFileCommand : IRequest
    {
        public required string CustomerCode { get; set; }

        public required IFormFile File { get; set; }

        public required string FileType { get; set; }
    }

    public class UploadCustomerFileCommandHandler : IRequestHandler<UploadCustomerFileCommand>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ICustomerFileStorage _fileStorage;

        public UploadCustomerFileCommandHandler(ICustomerRepository customerRepository,
            ICustomerFileStorage fileStorage)
        {
            _customerRepository = customerRepository;
            _fileStorage = fileStorage;
        }

        public async Task Handle(UploadCustomerFileCommand request, CancellationToken cancellationToken)
        {
            var fileType = Enum.Parse<FileType>(request.FileType, true);

            var customer = await _customerRepository.GetAsync(request.CustomerCode, cancellationToken);

            var file = new CustomerFile
            {
                Content = ConvertFormFileToBytes(request.File),
                ContentType = request.File.ContentType,
                CustomerCode = request.CustomerCode,
                FileName = request.File.FileName
            };

            var path = await _fileStorage.UploadToCustomerContainer(file);

            customer.UploadedFile(fileType, path);

            await _customerRepository.UpdateAsync(customer, cancellationToken);
        }

        private byte[] ConvertFormFileToBytes(IFormFile file)
        {
            using var fileStream = file.OpenReadStream();
            // Create a memory stream to hold the file contents
            using var ms = new MemoryStream();
            // Copy the file contents from the file stream to the memory stream
            fileStream.CopyTo(ms);
            // Get the contents of the memory stream as a byte array
            return ms.ToArray();
        }
    }
}
