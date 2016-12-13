namespace FFCG.BudgIT.Common
{
    public class FilterCommand
    {
        public string Keyword { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string OrderByPropertyName { get; set; }
        public bool IsAsc { get; set; }
    }
}
