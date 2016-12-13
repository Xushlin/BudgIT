using System.Web.Mvc;

namespace FFCG.BudgIT.Web.Controllers
{
   
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
    }
}
