using System.ComponentModel.DataAnnotations;

namespace Core.Infrastructure.Compliance.IPLocator
{
    public class IPServiceOptions
    {
        [Required]
        public required string Key { get; set; }
    }
}
