using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
