using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

public class Functions
{
    public async Task<APIGatewayProxyResponse> PostAsync(APIGatewayProxyRequest request, ILambdaContext context)
    {

        
        return new APIGatewayProxyResponse
        {
            StatusCode = (int)HttpStatusCode.OK,
            Body = "{\"body\": \"Hi from C# Lambda\"}",
            Headers = new Dictionary<string, string> { 
                { "Content-Type", "application/json" }, 
                { "Access-Control-Allow-Origin", "*" },
            }
        };
    }
}