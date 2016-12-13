using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using FFCG.BudgIT.Data.Mappings;
using FFCG.BudgIT.Data.Migrations;
using FFCG.BudgIT.Domain;

namespace FFCG.BudgIT.Data
{
    public class BudgItDbContext : DbContext
    {
        public BudgItDbContext()
            : base("name = BudgItDbContext")
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<BudgItDbContext, Configuration>());
        }

        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();

            modelBuilder.Configurations.Add(new UserMap());
        }
    }
}
