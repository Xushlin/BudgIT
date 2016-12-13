using System;

namespace FFCG.BudgIT.Repository.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        void Commit();
    }
}