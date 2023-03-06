using Core.Application.Commands.CustomerCommands;
using System.ComponentModel.DataAnnotations;

namespace Core.Presentation.Models.Requests.CustomerRequests
{
    public class CreatePrivateRequest
    {
        [Required]
        public required string Email { get; set; }

        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [Required]
        public required string DateOfBirth { get; set; }

        [Required]
        public required string CountryOfResidence { get; set; }

        [Required]
        public required string Phone { get; set; }


        public CreatePrivateCommand ToCommand(string customerCode, string ip)
        {
            return new CreatePrivateCommand
            {
                CustomerCode = customerCode,
                Email = Email,
                FirstName = FirstName,
                LastName = LastName,
                DateOfBirth = DateOfBirth,
                CountryOfResidence = CountryOfResidence,
                IP = ip,
                Phone = Phone
            };
        }
    }
}
