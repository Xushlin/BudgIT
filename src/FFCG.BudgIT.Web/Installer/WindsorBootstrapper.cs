using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Castle.Windsor.Installer;
using FFCG.BudgIT.DomainService;

namespace FFCG.BudgIT.WebAPI.Installer
{
    public static class WindsorBootstrapper
    {
        private static IWindsorContainer _container;

        public static void Initialize()
        {
            _container = new WindsorContainer();
            _container.Install(FromAssembly.This(),
                FromAssembly.Containing<ServiceInstaller>());

            _container.Register(Component.For<IWindsorContainer>().Instance(_container).LifestyleSingleton());

        }

        public static IWindsorContainer Container
        {
            get
            {
                return _container;
            }
        }
    }
}