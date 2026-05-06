import rss from "@astrojs/rss";
import { getPosts } from "../lib/graphql";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function GET(context) {
	const data = await getPosts(20);
	const posts = data?.posts?.nodes || [];
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.title,
			description: post.excerpt?.replace(/<[^>]+>/g, "") || "",
			link: `/blog/${post.slug}/`,
			pubDate: new Date(post.date),
		})),
		customData: `<language>en-us</language>`,
	});
}
