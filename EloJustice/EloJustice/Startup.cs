using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(EloJustice.Startup))]
namespace EloJustice
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
