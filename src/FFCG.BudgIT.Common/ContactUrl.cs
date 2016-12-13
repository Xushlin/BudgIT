using System;
using System.Web;

namespace FFCG.BudgIT.Common
{
    public static class BudgItUrl
    {
        public static string BuildWebUrl()
        {
            return "http://" + HttpContext.Current.Request.Headers.Get("Host");
        }
        public static string ParsePictureUrl(string url)
        {
            var index = url.LastIndexOf(@"/", StringComparison.Ordinal) + 1;
            return url.Substring(index);
        }
    }
}
