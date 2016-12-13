using System;
using FFCG.BudgIT.Domain;

namespace FFCG.BudgIT.DomainService
{
    public interface IUserService
    {
        User GetUserByEmail(string email);
        User GetUserById(Guid userId);
        void CreateUser(string name, string email, bool isAdmin);
    }
}