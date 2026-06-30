/**
 * Publishes a link post to the authorized Facebook Page.
 */
export async function postToFacebookPage(title: string, excerpt: string, slug: string) {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.indoordogpark.org';

    if (!pageId || !pageAccessToken) {
        console.error('Facebook Page ID or Access Token is missing in environment variables');
        return { success: false, error: 'Facebook configuration is missing in environment variables.' };
    }

    // Strip HTML tags and entities from the excerpt for the message text
    const cleanExcerpt = excerpt
        ? excerpt.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
        : '';

    const postUrl = `${siteUrl}/blog/${slug}`;
    const message = `🐾 New Blog Post!\n\n${title}\n\n${cleanExcerpt}\n\nRead the full article here:`;

    try {
        const fbUrl = `https://graph.facebook.com/v20.0/${pageId}/feed`;
        const response = await fetch(fbUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                link: postUrl,
                access_token: pageAccessToken,
            }),
        });

        const data = await response.json();
        if (data.error) {
            console.error('Facebook API Error:', data.error);
            return { success: false, error: data.error.message };
        }

        return { success: true, postId: data.id };
    } catch (error) {
        console.error('Facebook Request Failed:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
