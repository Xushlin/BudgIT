using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace FFCG.BudgIT.Common
{
    public static class LinqExtension
    {
        public static IQueryable<T> SortByProperty<T>(this IQueryable<T> source, string propertyName, bool asc)
        {
            if (source == null)
            {
                throw new ArgumentNullException("source");
            }

            propertyName = propertyName.Trim();
            if (String.IsNullOrEmpty(propertyName))
            {
                return source;
            }
            MemberExpression property = null;
            var parameter = Expression.Parameter(source.ElementType, String.Empty);
            if (propertyName.IndexOf(".", StringComparison.Ordinal) > 0)
            {
                property = Expression.Property(parameter, propertyName.Split('.')[0]);
                property = Expression.Property(property, propertyName.Split('.')[1]);
            }
            else
            {
                property = Expression.Property(parameter, propertyName);
            }

            var lambda = Expression.Lambda(property, parameter);


            Expression methodCallExpression = Expression.Call(typeof(Queryable), asc ? "OrderBy" : "OrderByDescending",
                new[] { source.ElementType, property.Type },
                source.Expression, Expression.Quote(lambda));

            return source.Provider.CreateQuery<T>(methodCallExpression);
        }

        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
        {
            return left.Compose(right, Expression.And);
        }
        public static Expression<T> Compose<T>(this Expression<T> first, Expression<T> second, Func<Expression, Expression, Expression> merge)
        {
            var map = first.Parameters.Select((f, i) => new { f, s = second.Parameters[i] }).ToDictionary(p => p.s, p => p.f);
            var secondBody = ParameterRebinder.ReplaceParameters(map, second.Body);
            return Expression.Lambda<T>(merge(first.Body, secondBody), first.Parameters);
        }
    }

    public class ParameterRebinder : ExpressionVisitor
    {
        private readonly Dictionary<ParameterExpression, ParameterExpression> _map;
        public ParameterRebinder(Dictionary<ParameterExpression, ParameterExpression> map)
        {
            _map = map ?? new Dictionary<ParameterExpression, ParameterExpression>();
        }
        public static Expression ReplaceParameters(Dictionary<ParameterExpression, ParameterExpression> map, Expression exp)
        {
            return new ParameterRebinder(map).Visit(exp);
        }
        protected override Expression VisitParameter(ParameterExpression p)
        {
            ParameterExpression replacement;
            if (_map.TryGetValue(p, out replacement))
            {
                p = replacement;
            }
            return base.VisitParameter(p);
        }
    }
}
