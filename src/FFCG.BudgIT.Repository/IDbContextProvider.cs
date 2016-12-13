using System;
using Castle.Windsor;
using FFCG.BudgIT.Data;

namespace FFCG.BudgIT.Repository
{
    public interface IDbContextProvider:IDisposable
    {
        BudgItDbContext GetBudgItDbContext();
    }

    public class Disposable : IDisposable
    {
        private bool _isDisposed;

        ~Disposable()
        {
            Dispose(false);
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        private void Dispose(bool disposing)
        {
            if (!_isDisposed && disposing)
            {
                DisposeCore();
            }

            _isDisposed = true;
        }
        protected virtual void DisposeCore()
        {
        }
    }

    public class DbContextProvider : Disposable, IDbContextProvider
    {
        private readonly IWindsorContainer _container;

        public DbContextProvider(IWindsorContainer container)
        {
            _container = container;
        }

        public BudgItDbContext GetBudgItDbContext()
        {
            return _container.Resolve<BudgItDbContext>();
        }
    }


}
