using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

public class Functions
{
    public async Task<APIGatewayProxyResponse> PostAsync(APIGatewayProxyRequest request, ILambdaContext context)
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = (int)HttpStatusCode.OK,
            Body = "Hi from C# Lambda",
            Headers = new Dictionary<string, string> { { "Content-Type", "application/json" } }
        };
    }
}