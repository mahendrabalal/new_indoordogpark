export async function postToPinterest(title: string, slug: string, imageUrl?: string) {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const boardId = process.env.PINTEREST_BOARD_ID;
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.indoordogpark.org';

    if (!accessToken || !boardId) {
        console.error('Pinterest API configuration is missing in environment variables');
        return { success: false, error: 'Pinterest configuration is missing in environment variables.' };
    }

    const postUrl = `${siteUrl}/blog/${slug}`;
    const description = `🐾 New Blog Post: ${title}\n\nRead more at: ${postUrl}`;
    
    // Fallback image if none provided
    const mediaUrl = imageUrl || `${siteUrl}/images/modern-indoor-dog-park-interior.png`;

    try {
        const response = await fetch('https://api.pinterest.com/v5/pins', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                board_id: boardId,
                title: title,
                description: description,
                link: postUrl,
                media_source: {
                    source_type: 'image_url',
                    url: mediaUrl,
                },
            }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Pinterest API Error:', data);
            return { success: false, error: data.message || 'Unknown Pinterest API error' };
        }

        return { success: true, postId: data.id };
    } catch (error) {
        console.error('Pinterest Request Failed:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
