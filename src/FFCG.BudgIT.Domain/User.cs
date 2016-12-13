using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FFCG.BudgIT.Domain
{
    public class User
    {
        public Guid UserId { get; private set; }
        public string Name { get; private set; }
        public string Email { get; private set; }
        public bool IsAdmin { get; private set; }
        public bool IsDeleted { get; private set; }
        public DateTime CratedDate { get; private set; }

        public static User Create(string name, string email, bool isAdmin)
        {
            return new User
            {
                UserId = Guid.NewGuid(),
                Name = name,
                Email = email,
                IsAdmin = isAdmin,
                IsDeleted = false,
                CratedDate = DateTime.Now
            };
        }
    }
}
