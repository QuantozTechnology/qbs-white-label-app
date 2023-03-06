using System.ComponentModel.DataAnnotations;

namespace Core.Infrastructure.Nexus.SigningService
{
    public class SigningServiceOptions
    {
        [Required]
        public required string CreateSigningPairKey { get; set; }

        [Required]
        public required string CreateSignatureKey { get; set; }

        public required string StellarNetworkPassphrase { get; set; }
    }
}
