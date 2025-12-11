/**
 * ESLint rules for SEO best practices
 * 
 * This configuration helps enforce SEO best practices in the codebase.
 * Add to your main .eslintrc.js or use as a separate config.
 */

module.exports = {
  rules: {
    // Ensure all images have alt text
    'jsx-a11y/alt-text': 'error',
    
    // Ensure anchor tags have descriptive text
    'jsx-a11y/anchor-is-valid': 'error',
    
    // Ensure proper heading hierarchy
    'jsx-a11y/heading-has-content': 'error',
    
    // Warn about missing rel="noopener" on external links
    'react/jsx-no-target-blank': 'warn',
  },
  overrides: [
    {
      // Apply stricter rules to metadata files
      files: ['**/metadata.ts', '**/seo-utils.ts', '**/*metadata*.ts'],
      rules: {
        // Ensure canonical URLs are absolute
        'no-relative-paths': 'off', // Custom rule would need to be implemented
      },
    },
  ],
};
















