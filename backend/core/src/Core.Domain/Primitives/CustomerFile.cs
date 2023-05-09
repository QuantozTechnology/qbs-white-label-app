// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

namespace Core.Domain.Primitives
{
    public class CustomerFile
    {
        public required string CustomerCode { get; set; }

        public required string FileName { get; set; }

        public required string ContentType { get; set; }

        public required byte[] Content { get; set; }
    }
}
