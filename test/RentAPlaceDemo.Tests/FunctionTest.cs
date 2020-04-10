using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Xunit;
using Amazon.Lambda.Core;
using Amazon.Lambda.TestUtilities;
using Amazon.Lambda.APIGatewayEvents;

using RentAPlaceDemo;

namespace RentAPlaceDemo.Tests
{
    public class FunctionTest
    {
        public FunctionTest()
        {
        }

        [Fact]
        public void TestPostMethod()
        {
            TestLambdaContext context;
            APIGatewayProxyRequest request;
            Task<APIGatewayProxyResponse> response;

            Functions functions = new Functions();


            request = new APIGatewayProxyRequest();
            context = new TestLambdaContext();
            response = functions.PostAsync(request, context);
            Assert.Equal(200, response.Result.StatusCode);
            Assert.Equal("Hi from C# Lambda", response.Result.Body);
        }
    }
}
