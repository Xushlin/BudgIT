namespace FFCG.BudgIT.Repository.UnitOfWork
{
    public interface IUnitOfWorkFactory
    {
        IUnitOfWork GetCurrentUnitOfWork();
    }
}