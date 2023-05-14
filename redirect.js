function redirectPlugin(config) {
  // Retrieve the WordPress GraphQL endpoint from the environment variables
  const wordpressGraphQLEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

  // Add a redirect rule for WordPress posts
  config.redirects = async () => {
    const { data } = await fetch(`${wordpressGraphQLEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            posts {
              nodes {
                slug
                uri
              }
            }
          }
        `,
      }),
    }).then((res) => res.json());

    const redirects = data.posts.nodes.map((post) => ({
      source: `/${post.slug}`,
      destination: `${post.uri}`,
      permanent: true,
    }));

    return redirects;
  };

  return config;
}

module.exports = redirectPlugin;
