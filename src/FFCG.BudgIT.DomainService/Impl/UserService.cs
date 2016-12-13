using System;
using FFCG.BudgIT.Domain;
using FFCG.BudgIT.Repository;

namespace FFCG.BudgIT.DomainService.Impl
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public User GetUserByEmail(string email)
        {
            return _userRepository.GetUserByEmail(email);
        }

        public User GetUserById(Guid userId)
        {
            return _userRepository.Get(userId);
        }

        public void CreateUser(string name, string email, bool isAdmin)
        {
            throw new NotImplementedException();
        }
    }
}