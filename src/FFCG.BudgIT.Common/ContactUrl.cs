using System;
using System.Web;

namespace FFCG.BudgIT.Common
{
    public static class ContactUrl
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

        public static string GetPictureUrl(string picture)
        {
            if (string.IsNullOrEmpty(picture))
            {
                return null;
            }

            return BuildWebUrl() + ConfigurationProvider.UploadFileFolder + picture;
        }
    }
}
