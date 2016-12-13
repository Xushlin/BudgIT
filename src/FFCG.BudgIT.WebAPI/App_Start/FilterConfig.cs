using System.Web.Http.Filters;
using FFCG.BudgIT.WebAPI.Filters;

namespace FFCG.BudgIT.WebAPI
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(HttpFilterCollection filters)
        {
            filters.Add(new HandleExceptionFilterAttribute());
        }
    }
}
