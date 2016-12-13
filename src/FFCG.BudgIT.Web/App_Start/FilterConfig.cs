using System.Web.Http.Filters;
using FFCG.BudgIT.Web.Filters;

namespace FFCG.BudgIT.Web
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(HttpFilterCollection filters)
        {
            filters.Add(new HandleExceptionFilterAttribute());
        }
    }
}
