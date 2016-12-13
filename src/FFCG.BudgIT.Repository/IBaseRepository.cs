using System;
using System.Collections.Generic;

namespace FFCG.BudgIT.Repository
{
    public interface IBaseRepository<TEntity> where TEntity:class 
    {
        TEntity Add(TEntity t);
        void Edit(TEntity t);
        void Delete(Guid id);
        IEnumerable<TEntity> GetAll();
        TEntity Get(Guid id);
    }
}
