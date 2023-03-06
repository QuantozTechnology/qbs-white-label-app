using Core.Domain.Abstractions;
using Core.Domain.Primitives;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace Core.Infrastructure.CustomerFileStorage
{
    public class BlobStorage : ICustomerFileStorage
    {
        private readonly BlobStorageOptions _options;

        public BlobStorage(BlobStorageOptions options)
        {
            _options = options;
        }

        private CloudBlobContainer GetBlobContainer()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(_options.StorageConnectionString);

            // Create a CloudBlobClient object using the CloudStorageAccount
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Get a reference to the container using the container name
            CloudBlobContainer container = blobClient.GetContainerReference(_options.ContainerName);

            // Create the container if it doesn't already exist
            container.CreateIfNotExistsAsync();

            return container;
        }

        private static CloudBlobDirectory GetCustomerBlobDirectory(CloudBlobContainer container, string customerCode)
        {
            // Get a reference to the customer specific directory inside the container
            CloudBlobDirectory customerDirectory = container.GetDirectoryReference(customerCode);

            return customerDirectory;
        }

        public async Task<string> UploadToCustomerContainer(CustomerFile file)
        {
            // Get a reference to the blob container
            var container = GetBlobContainer();

            // Get a reference to the customer specific directory inside the container
            var customerDirectory = GetCustomerBlobDirectory(container, file.CustomerCode);

            // Get a reference to the file within the customer specific directory
            var blob = customerDirectory.GetBlockBlobReference(file.FileName);

            // Check if the file exists
            if (!await blob.ExistsAsync())
            {
                if (file.Content.Length > 0)
                {
                    // Upload the file to the customer specific directory
                    await blob.UploadFromByteArrayAsync(file.Content, 0, file.Content.Length);

                    blob.Properties.ContentType = file.ContentType;

                    // Save the updated properties of the file
                    await blob.SetPropertiesAsync();
                }
            }

            // Return the file path of the uploaded blob
            return blob.Uri.ToString();
        }
    }
}