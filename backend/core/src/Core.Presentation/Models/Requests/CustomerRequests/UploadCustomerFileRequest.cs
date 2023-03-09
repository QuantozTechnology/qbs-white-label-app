// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.CustomerCommands;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Core.Presentation.Models.Requests.CustomerRequests
{
    public class UploadCustomerFileRequest
    {
        [Required]
        public required IFormFile File { get; set; }

        public UploadCustomerFileCommand ToCommand(string customerCode, string fileType)
        {
            return new UploadCustomerFileCommand
            {
                CustomerCode = customerCode,
                File = File,
                FileType = fileType
            };
        }
    }
}
