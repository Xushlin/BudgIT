using System;
using System.Collections.Generic;
using System.Linq;
using FFCG.BudgIT.Domain;

namespace FFCG.BudgIT.Repository.Impl
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(IDbContextProvider dbContextProvider) : base(dbContextProvider)
        {
        }

        public User GetUserByEmail(string email)
        {
            return DbContext.Users.SingleOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }

        public bool HasAdmin(string email)
        {
            return DbContext.Users.Any(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase) && x.IsAdmin);
        }
    }
}