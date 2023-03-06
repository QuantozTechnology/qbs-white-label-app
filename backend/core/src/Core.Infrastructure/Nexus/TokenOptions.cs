using System.ComponentModel.DataAnnotations;

namespace Core.Infrastructure.Nexus
{
    public class TokenOptions
    {
        public required Blockchain Blockchain { get; set; }

        [MinLength(1)]
        public required string[] CustomerTokens { get; set; }
    }
}
