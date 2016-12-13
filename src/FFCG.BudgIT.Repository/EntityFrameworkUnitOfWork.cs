using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FFCG.BudgIT.Repository.UnitOfWork;

namespace FFCG.BudgIT.Repository
{
    public class EntityFrameworkUnitOfWork : IUnitOfWork
    {
        private DbContext _dbContext;

        public EntityFrameworkUnitOfWork(IDbContextProvider dbProvider)
        {
            _dbContext = dbProvider.GetBudgItDbContext();
        }

        public void Commit()
        {
            _dbContext.SaveChanges();
        }

        public void Dispose()
        {
            if (_dbContext != null)
            {
                _dbContext.Dispose();
                _dbContext = null;
            }
            GC.SuppressFinalize(this);
        }
    }
}
