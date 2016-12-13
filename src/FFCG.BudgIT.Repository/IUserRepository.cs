using System.Collections.Generic;
using FFCG.BudgIT.Domain;

namespace FFCG.BudgIT.Repository
{
    public interface IUserRepository : IBaseRepository<User>
    {
        User GetUserByEmail(string email);
        bool HasAdmin(string email);
    }
}