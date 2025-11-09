# WordPress Blog Integration Setup Guide

This guide explains how to set up WordPress as a headless CMS for the blog functionality in your California Dog Parks Directory.

## Overview

The WordPress integration allows you to:
- Create and manage blog posts in WordPress
- Use WordPress categories and tags for content organization
- Display blog posts on your Next.js frontend
- Maintain SEO-friendly URLs and metadata
- Leverage WordPress's powerful content management capabilities

## Prerequisites

- WordPress installation (version 5.0 or higher)
- Admin access to WordPress dashboard
- Basic understanding of WordPress REST API

## WordPress Setup

### 1. Install WordPress

If you don't have WordPress installed yet:

1. Download WordPress from [wordpress.org](https://wordpress.org/)
2. Install on your web server or use a managed hosting service
3. Complete the initial setup wizard

### 2. Configure WordPress for Headless Use

#### Enable REST API
WordPress REST API is enabled by default in WordPress 4.7+. Ensure it's working by visiting:
```
https://your-wordpress-site.com/wp-json/wp/v2/
```

#### Configure Permalinks
1. Go to **Settings → Permalinks** in WordPress admin
2. Select **"Post name"** or **"Custom Structure"**
3. Save changes

This ensures clean URLs like `/blog/sample-post`

#### Configure CORS (if needed)
If your WordPress and Next.js sites are on different domains, add this to your theme's `functions.php`:

```php
function allow_cors_headers() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
}, 15);
```

### 3. Install Recommended Plugins

#### REST API Enhancements
- **WP REST API Menus**: For navigation menus
- **WP REST API Controller**: For additional API controls

#### SEO and Performance
- **Yoast SEO** or **Rank Math**: For better SEO management
- **WP Super Cache** or **W3 Total Cache**: For performance optimization

### 4. Create Application Password

1. Go to **Users → Profile** in WordPress admin
2. Scroll down to **"Application Passwords"**
3. Enter a name like "Next.js Blog Integration"
4. Click **"Add New Application Password"**
5. Copy the generated password immediately (you won't see it again)

## Next.js Configuration

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# WordPress Configuration
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your_wp_username
WORDPRESS_PASSWORD=your_wp_application_password
```

### 2. Update .env.example

The `.env.example` file has been updated with WordPress configuration variables.

## WordPress Content Setup

### 1. Create Categories

1. Go to **Posts → Categories**
2. Create relevant categories for your dog park blog:
   - Dog Training
   - Park Reviews
   - Pet Health
   - Dog-Friendly Activities
   - Local Events

### 2. Create Tags

1. Go to **Posts → Tags**
2. Create relevant tags:
   - Tips
   - Reviews
   - California
   - Indoor Parks
   - Outdoor Parks

### 3. Create Blog Posts

1. Go to **Posts → Add New**
2. Create sample blog posts with:
   - Featured images (recommended 1200x630px)
   - Proper categories and tags
   - SEO-optimized titles and meta descriptions

### 4. Configure Featured Images

Ensure featured images are properly set up:

1. In WordPress admin, go to **Settings → Media**
2. Set appropriate image sizes:
   - Thumbnail: 150x150
   - Medium: 300x300
   - Large: 1024x1024
3. Save changes

## Testing the Integration

### 1. Test API Endpoints

Verify these endpoints work with your WordPress site:

```bash
# Test posts endpoint
curl "https://your-wordpress-site.com/wp-json/wp/v2/posts?per_page=5"

# Test categories endpoint
curl "https://your-wordpress-site.com/wp-json/wp/v2/categories"

# Test with authentication (replace with your credentials)
curl -u "username:password" "https://your-wordpress-site.com/wp-json/wp/v2/posts?status=private"
```

### 2. Test Next.js Application

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to:
   - `http://localhost:3000/blog` - Main blog page
   - `http://localhost:3000/blog/[post-slug]` - Individual posts
   - `http://localhost:3000/blog/category/[category-slug]` - Category pages
   - `http://localhost:3000/blog/tag/[tag-slug]` - Tag pages

## Performance Optimization

### 1. Enable Caching

The Next.js implementation includes caching:
- Blog posts: 5 minutes (300 seconds)
- Categories and tags: 1 hour (3600 seconds)
- Individual posts: 5 minutes

### 2. Image Optimization

- Use WebP format for images in WordPress
- Compress images before uploading
- Use appropriate image sizes

### 3. WordPress Caching

Enable caching in WordPress:
- Install a caching plugin (WP Super Cache, W3 Total Cache)
- Configure appropriate cache times
- Enable GZIP compression

## SEO Considerations

### 1. URL Structure

The integration creates clean URLs:
- `/blog/` - Main blog page
- `/blog/[post-slug]/` - Individual posts
- `/blog/category/[category-slug]/` - Category pages
- `/blog/tag/[tag-slug]/` - Tag pages

### 2. Meta Tags

The implementation automatically generates:
- Page titles
- Meta descriptions
- Open Graph tags for social sharing
- Twitter Card metadata

### 3. Schema Markup

Consider adding schema markup in WordPress:
- Install an SEO plugin (Yoast SEO, Rank Math)
- Configure article schema
- Add organization schema

## Security Best Practices

### 1. API Authentication

- Use Application Passwords instead of regular user passwords
- Restrict API access to your Next.js domain
- Implement rate limiting on your WordPress API

### 2. WordPress Security

- Keep WordPress and plugins updated
- Use strong passwords
- Enable two-factor authentication
- Install security plugins (Wordfence, Sucuri)

### 3. CORS Configuration

Configure CORS headers to only allow your Next.js domain:

```php
function allow_cors_headers() {
    $allowed_origins = ['https://your-nextjs-site.com'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        allow_cors_headers();
        return $value;
    });
}, 15);
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is properly configured in WordPress
2. **404 Errors**: Check permalinks configuration in WordPress
3. **Authentication Issues**: Verify Application Password is correct
4. **Slow Loading**: Check WordPress caching configuration
5. **Missing Images**: Ensure featured images are properly set in WordPress

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify WordPress API endpoints are accessible
3. Test with curl commands
4. Check WordPress error logs
5. Verify Next.js environment variables

## Maintenance

### Regular Tasks

1. Update WordPress and plugins regularly
2. Monitor API performance
3. Check blog content regularly
4. Back up WordPress database
5. Review security logs

### Content Strategy

1. Create content calendar
2. Optimize images for web
3. Write SEO-friendly titles and descriptions
4. Use categories and tags consistently
5. Monitor blog analytics and performance

## Support

For issues with this integration:

1. Check the WordPress REST API documentation
2. Review Next.js documentation for API routes
3. Test API endpoints individually
4. Check browser developer tools for debugging
5. Review WordPress error logs

---

This setup provides a robust foundation for managing blog content through WordPress while maintaining the performance and SEO benefits of Next.js.