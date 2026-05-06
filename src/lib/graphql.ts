const WORDPRESS_GRAPHQL_URL = 'https://senzans.rongyun.online/graphql';

export async function fetchGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
	const response = await fetch(WORDPRESS_GRAPHQL_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`GraphQL request failed: ${response.status} - ${errorText}`);
	}

	const result: { data?: T; errors?: Array<{ message: string }> } = await response.json();

	if (result.errors && result.errors.length > 0) {
		throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
	}

	if (!result.data) {
		throw new Error('No data returned from GraphQL');
	}

	return result.data;
}

export async function getPosts(limit = 10) {
	const query = `
		query GetPosts($limit: Int) {
			posts(first: $limit) {
				nodes {
					id
					title
					slug
					date
					excerpt
					content
					featuredImage {
						node {
							sourceUrl
							altText
						}
					}
					categories {
						nodes {
							name
							slug
						}
					}
					tags {
						nodes {
							name
							slug
						}
					}
				}
			}
		}
	`;

	return fetchGraphQL<{
		posts: {
			nodes: Array<{
				id: string;
				title: string;
				slug: string;
				date: string;
				excerpt: string;
				content: string;
				featuredImage: {
					node: {
						sourceUrl: string;
						altText: string;
					};
				} | null;
				categories: {
					nodes: Array<{
						name: string;
						slug: string;
					}>;
				};
				tags: {
					nodes: Array<{
						name: string;
						slug: string;
					}>;
				};
			}>;
		};
	}>(query, { limit });
}

export async function getPostBySlug(slug: string) {
	const query = `
		query GetPostBySlug($slug: String!) {
			postBy(slug: $slug) {
				id
				title
				slug
				date
				content
				excerpt
				featuredImage {
					node {
						sourceUrl
						altText
					}
				}
				categories {
					nodes {
						name
						slug
					}
				}
				tags {
					nodes {
						name
						slug
					}
				}
				author {
					node {
						name
						avatar {
							url
						}
					}
				}
			}
		}
	`;

	return fetchGraphQL<{
		postBy: {
			id: string;
			title: string;
			slug: string;
			date: string;
			content: string;
			excerpt: string;
			featuredImage: {
				node: {
					sourceUrl: string;
					altText: string;
				};
			} | null;
			categories: {
				nodes: Array<{
					name: string;
					slug: string;
				}>;
			};
			tags: {
				nodes: Array<{
					name: string;
					slug: string;
				}>;
			};
			author: {
				node: {
					name: string;
					avatar: {
						url: string;
					};
				};
			} | null;
		};
	}>(query, { slug });
}

export async function getCategories() {
	const query = `
		query GetCategories {
			categories {
				nodes {
					id
					name
					slug
					count
					description
				}
			}
		}
	`;

	return fetchGraphQL<{
		categories: {
			nodes: Array<{
				id: string;
				name: string;
				slug: string;
				count: number;
				description: string;
			}>;
		};
	}>(query);
}

export async function getPages() {
	const query = `
		query GetPages {
			pages {
				nodes {
					id
					title
					slug
					content
					date
				}
			}
		}
	`;

	return fetchGraphQL<{
		pages: {
			nodes: Array<{
				id: string;
				title: string;
				slug: string;
				content: string;
				date: string;
			}>;
		};
	}>(query);
}

export async function getPageBySlug(slug: string) {
	const query = `
		query GetPageBySlug($slug: String!) {
			pageBy(slug: $slug) {
				id
				title
				slug
				content
				date
			}
		}
	`;

	return fetchGraphQL<{
		pageBy: {
			id: string;
			title: string;
			slug: string;
			content: string;
			date: string;
		};
	}>(query, { slug });
}
