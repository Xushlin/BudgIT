using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;
using FFCG.BudgIT.Common;

namespace FFCG.BudgIT.Web.Filters
{
    public class HandleExceptionFilterAttribute: ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Exception is BudgItException)
            {
                var code = HttpStatusCode.BadRequest;
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                    code, new
                    {
                        Code = code,
                        Errors = new[]
                        {
                            new
                            {
                                Name = (actionExecutedContext.Exception as BudgItException).Key,
                                Error =(actionExecutedContext.Exception as BudgItException).Message
                            }
                        }
                    });
            }
            else if (actionExecutedContext.Exception is UnauthorizedAccessException)
            {
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
               HttpStatusCode.Unauthorized, new
               {
                   Code = HttpStatusCode.Unauthorized,
                   Errors = new[]
                    {new
                            {
                                Name = "Error",
                                Error =actionExecutedContext.Exception.Message
                            }
                    }
               });
            }
            else
            {
                actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(
                    HttpStatusCode.BadRequest, new
                    {
                        Code = HttpStatusCode.BadRequest,
                        Errors = new[]
                        {
                            new
                            {
                                Name = "Error",
                                Error = "Bad request!"
                            }
                        }
                    });
            }
            base.OnException(actionExecutedContext);
        }
    }
}