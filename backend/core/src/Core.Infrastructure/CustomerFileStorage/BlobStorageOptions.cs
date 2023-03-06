using System.ComponentModel.DataAnnotations;

namespace Core.Infrastructure.CustomerFileStorage
{
    public class BlobStorageOptions
    {
        [Required]
        public required string StorageConnectionString { get; set; }

        [Required]
        public required string ContainerName { get; set; }
    }
}