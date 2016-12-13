using System;

namespace FFCG.BudgIT.Common
{
    public class BudgItException : Exception
    {
        public string Key { get; private set; }
        public object[] Arguments { get; private set; }

        private BudgItException()
        { }

        public BudgItException(string key, string message)
            : base(message)
        {
            Key = key;
        }

        public BudgItException(string key, string message, params object[] arguments)
            : base(string.Format(message, arguments))
        {
            Key = key;
            Arguments = arguments;
        }

        public BudgItException(string key, string message, Exception exception)
            : base(message, exception)
        {
            Key = key;
        }

        public BudgItException(string key, string message, Exception exception, params object[] arguments)
            : base(string.Format(message, arguments), exception)
        {
            Key = key;
            Arguments = arguments;
        }
    }
}
