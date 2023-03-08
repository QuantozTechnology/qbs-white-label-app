using Microsoft.VisualStudio.TestTools.UnitTesting;
using Core.Domain.Entities.CallbackAggregate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities.CallbackAggregate.Tests
{
    [TestClass()]
    public class CallbackTests
    {
        [TestMethod()]
        public void SentTest()
        {
            var now = DateTimeOffset.UtcNow;
            using var context = new DateTimeProviderContext(now);

            var callback = Callback.NewPaymentRequestUpdatedCallback("test_destinationUrl", "test_content");
            callback.Sent();

            Assert.AreEqual(CallbackStatus.Sent, callback.Status);
            Assert.AreEqual(now, callback.UpdatedOn);
        }
    }
}