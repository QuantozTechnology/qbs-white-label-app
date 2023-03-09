// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

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