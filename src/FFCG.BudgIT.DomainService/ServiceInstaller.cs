using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Castle.Windsor.Installer;
using FFCG.BudgIT.DomainService.Impl;
using FFCG.BudgIT.Repository;

namespace FFCG.BudgIT.DomainService
{
    public class ServiceInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Install(FromAssembly.Containing<RepositoryInstaller>());
            container.Register(Classes.FromAssemblyContaining<UserService>().InSameNamespaceAs<UserService>().LifestylePerWebRequest()
               .WithServiceAllInterfaces());

        }
    }
}
