using Core.Domain.Primitives;
using Core.Presentation.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace Core.Presentation.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [ApiController]
    public class BaseController : Controller
    {
        protected ISender _sender;

        public BaseController(ISender sender)
        {
            _sender = sender;
        }

        protected string GetUserId()
        {
            if (User.Identity is not ClaimsIdentity identity)
            {
                throw new Exception($"Identity is not of type ClaimsIdentity");
            }

            var claim = identity.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
            {
                throw new Exception($"{ClaimTypes.NameIdentifier} not found in claims");
            }

            return claim.Value;
        }

        protected string GetIP()
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress;

            if (ipAddress == null)
            {
                throw new Exception($"Remote IP address cannot be empty");
            }

            return ipAddress.ToString();
        }

        protected static CustomResponse<TResponse> ConstructCustomResponse<TEntity, TResponse>(TEntity entity, Func<TEntity, TResponse> convert)
        {
            var response = convert(entity);
            return new CustomResponse<TResponse>(response);
        }

        protected static CustomResponse<IEnumerable<TResponse>> ConstructCustomResponse<TEntity, TResponse>(IEnumerable<TEntity> entities, Func<TEntity, TResponse> convert)
        {
            var response = entities.Select(e => convert(e));
            return new CustomResponse<IEnumerable<TResponse>>(response);
        }

        protected static CustomResponse<IDictionary<TKey, TResponse>> ConstructCustomResponse<TKey, TValue, TResponse>(
            IDictionary<TKey, TValue> dictionary, Func<TValue, TResponse> convert) where TKey : notnull
        {
            var response = dictionary.ToDictionary(kv => kv.Key, kv => convert(kv.Value));
            return new CustomResponse<IDictionary<TKey, TResponse>>(response);
        }

        protected CustomResponse<IEnumerable<TResponse>> ConstructCustomResponse<TEntity, TResponse>(Paged<TEntity> paged, Func<TEntity, TResponse> convert)
        {
            var metadata = new
            {
                TotalCount = paged.Total,
                paged.PageSize,
                CurrentPage = paged.Page,
                paged.PreviousPage,
                paged.NextPage,
                paged.TotalPages
            };

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(metadata));

            return ConstructCustomResponse(paged.Items, convert);
        }
    }
}
