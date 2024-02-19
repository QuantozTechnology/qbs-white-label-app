// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Core.Application.Commands.CustomerCommands;
using Core.Application.Validators.Commands.CustomerValidators;
using Core.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Text;

namespace Core.ApplicationTests.Validators
{
    [TestClass()]
    public class UploadCustomerFileCommandValidatorTests
    {
        [TestMethod]
        [DataRow(null, null, null)]
        [DataRow(null, typeof(MockFormFile), FileType.Selfie)]
        [DataRow("", typeof(MockFormFile), FileType.Passport)]
        public void Should_Validate_Upload_Customer_File_Command_With_Null_File_Test(string customerCode, Type fileType, FileType expectedFileType)
        {
            var validator = new UploadCustomerFileCommandValidator();

            IFormFile file = null;
            if (fileType != null)
            {
                var stream = new MemoryStream(Encoding.UTF8.GetBytes("dummy file content"));
                file = new MockFormFile(stream, 0, "file.png", "file.png", "file.png");
            }

            var command = new UploadCustomerFileCommand
            {
                CustomerCode = customerCode,
                File = file,
                FileType = expectedFileType.ToString()
            };

            var result = validator.Validate(command);

            Assert.IsFalse(result.IsValid);
        }

        [TestMethod]
        [DataRow("Code123", typeof(MockFormFile), FileType.Selfie)]
        [DataRow("Code456", typeof(MockFormFile), FileType.Passport)]
        public void Should_Validate_Upload_Customer_File_Command_With_Valid_File_Test(string customerCode, Type fileType, FileType expectedFileType)
        {
            var validator = new UploadCustomerFileCommandValidator();

            var stream = new MemoryStream(Encoding.UTF8.GetBytes("dummy file content"));
            var file = new MockFormFile(stream, 0, "file.png", "file.png", "file.png");
            var command = new UploadCustomerFileCommand
            {
                CustomerCode = customerCode,
                File = file,
                FileType = expectedFileType.ToString()
            };

            var result = validator.Validate(command);

            Assert.IsTrue(result.IsValid);
            Assert.AreEqual(0, result.Errors.Count);
        }
    }

    public class MockFormFile : IFormFile
        {
            private readonly Stream stream;

            public MockFormFile(Stream stream, long length, string contentDisposition, string name, string fileName)
            {
                this.stream = stream;
                Length = length;
                ContentDisposition = contentDisposition;
                Name = name;
                FileName = fileName;
                ContentType = null;
            }

            public string ContentType { get; set; }
            public string ContentDisposition { get; set; }
            public IHeaderDictionary Headers => (IHeaderDictionary)new Dictionary<string, StringValues>();
            public long Length { get; }
            public string Name { get; }
            public string FileName { get; }

            public void CopyTo(Stream target)
            {
                stream.CopyTo(target);
            }

            public Task CopyToAsync(Stream target, CancellationToken cancellationToken = default)
            {
                return stream.CopyToAsync(target, cancellationToken);
            }

            public Stream OpenReadStream()
            {
                return stream;
            }
        }
}
