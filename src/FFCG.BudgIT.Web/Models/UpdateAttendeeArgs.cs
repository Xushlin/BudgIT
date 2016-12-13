namespace FFCG.ForefrontContacts.WebAPI.Models
{
    public class UpdateAttendeeArgs
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Company { get; set; }
        public string PhoneNumber { get; set; }
        public string LinkedIn { get; set; }
        public string ImageUrl { get; set; }
    }
}