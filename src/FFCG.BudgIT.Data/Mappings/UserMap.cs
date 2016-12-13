using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace FFCG.BudgIT.Data.Mappings
{
    public class UserMap : EntityTypeConfiguration<Domain.User>
    {
        public UserMap()
        {
            this.ToTable("User");
            
            this.HasKey(t => t.UserId);
            this.Property(m => m.UserId).HasColumnName("UserId").IsRequired().HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            this.Property(m => m.Name).HasColumnName("Name").IsRequired().HasMaxLength(255);
            this.Property(m => m.Email).HasColumnName("Email").IsRequired().HasMaxLength(255);
            this.Property(m => m.CratedDate).HasColumnName("CratedDate").IsRequired();
            this.Property(m => m.IsAdmin).HasColumnName("IsAdmin").IsRequired();
            this.Property(m => m.IsDeleted).HasColumnName("IsDeleted").IsRequired();
        }
    }
}
