using System.Web.Http;
using FFCG.BudgIT.DomainService;
using FFCG.BudgIT.Web.Models;
using FFCG.BudgIT.WebAPI.Models;

namespace FFCG.BudgIT.Web.Controllers
{
    [Authorize]
    public class UserController : ApiController
    {
        private readonly IUserService _userService;

        public UserController(
            IUserService userService)
        {
            _userService = userService;
        }
        
        [HttpPost]
        [ActionName("CreateUser")]
        public void CreateUser(UserCommand command)
        {
            _userService.CreateUser(command.Name, command.Email, command.IsAdmin);
        }
    }
}