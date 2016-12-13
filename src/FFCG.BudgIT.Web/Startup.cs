using Microsoft.Owin;
using Owin;
using Startup = FFCG.BudgIT.Web.Startup;

[assembly: OwinStartup(typeof(Startup))]

namespace FFCG.BudgIT.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
