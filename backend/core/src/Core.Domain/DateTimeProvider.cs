// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using System.Collections;

namespace Core.Domain
{
    // https://dvoituron.com/2020/01/22/UnitTest-DateTime/
    public class DateTimeProvider
    {
        public static DateTimeOffset Now
            => DateTimeProviderContext.Current == null
                    ? DateTimeOffset.Now
                    : DateTimeProviderContext.Current.ContextDateTimeNow;

        public static DateTimeOffset UtcNow => Now.ToUniversalTime();

        public static long UnixTimeInMilliseconds => Now.ToUnixTimeMilliseconds();

        public static DateTimeOffset Today => Now.Date;

        public static DateTimeOffset FromUnixTimeInMilliseconds(long unix)
        {
            return DateTimeOffset.FromUnixTimeMilliseconds(unix);
        }

        public static long? ToUnixTimeInMilliseconds(DateTimeOffset? dateTime)
        {
            return dateTime?.ToUnixTimeMilliseconds();
        }

        public static long ToUnixTimeInMilliseconds(DateTimeOffset dateTime)
        {
            return dateTime.ToUnixTimeMilliseconds();
        }
    }

    public class DateTimeProviderContext : IDisposable
    {
        internal DateTimeOffset ContextDateTimeNow;
        private static readonly ThreadLocal<Stack> ThreadScopeStack = new(() => new Stack());

        public DateTimeProviderContext(DateTimeOffset contextDateTimeNow)
        {
            ContextDateTimeNow = contextDateTimeNow;
            ThreadScopeStack.Value!.Push(this);
        }

        public static DateTimeProviderContext? Current
        {
            get
            {
                if (ThreadScopeStack.Value!.Count == 0)
                {
                    return null;
                }
                else
                {
                    return ThreadScopeStack.Value!.Peek() as DateTimeProviderContext;
                }
            }
        }

        public void Dispose()
        {
            ThreadScopeStack.Value!.Pop();
        }
    }
}
