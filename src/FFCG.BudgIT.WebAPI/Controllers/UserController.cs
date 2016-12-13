using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using FFCG.BudgIT.DomainService;
using FFCG.BudgIT.WebAPI.Models;

namespace FFCG.BudgIT.WebAPI.Controllers
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