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
