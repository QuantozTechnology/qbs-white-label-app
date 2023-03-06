using Core.Application.Commands.CustomerCommands;
using System.ComponentModel.DataAnnotations;

namespace Core.Presentation.Models.Requests.CustomerRequests
{
    public class CreateMerchantRequest
    {
        [Required]
        public required string Email { get; set; }

        [Required]
        public required string CompanyName { get; set; }

        [Required]
        public required string ContactPersonFullName { get; set; }

        [Required]
        public required string CountryOfRegistration { get; set; }

        public CreateMerchantCommand ToCommand(string customerCode, string ip)
        {
            return new CreateMerchantCommand
            {
                CustomerCode = customerCode,
                CompanyName = CompanyName,
                Email = Email,
                ContactPersonFullName = ContactPersonFullName,
                CountryOfRegistration = CountryOfRegistration,
                IP = ip
            };
        }
    }
}
