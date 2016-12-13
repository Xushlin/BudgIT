using System.Web.Http;
using FFCG.BudgIT.DomainService;

namespace FFCG.BudgIT.WebAPI.Controllers
{
    [Authorize]
    public class LoginController : ApiController
    {
        private readonly IUserService _usrService;

        public LoginController(
            IUserService userService)
        {
            _usrService = userService;
        }
        
    }
}
