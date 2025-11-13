// Mock blog data for testing while WordPress API is being set up

export const mockBlogPosts = [
  {
    id: 1,
    title: "Welcome to California Dog Parks!",
    slug: "welcome-to-california-dog-parks",
    content: `
      <h2>Welcome to Our California Dog Parks Blog!</h2>

      <p>We're excited to share tips, reviews, and stories about the best dog parks across California. Whether you're looking for indoor facilities, outdoor adventures, or dog-friendly activities, you'll find everything you need right here.</p>

      <h3>What to Expect</h3>

      <p>Our blog will feature:</p>
      <ul>
        <li><strong>Park Reviews</strong> - Detailed reviews of dog parks throughout California</li>
        <li><strong>Training Tips</strong> - Expert advice on dog training and socialization</li>
        <li><strong>Health & Safety</strong> - Information about keeping your dog healthy and safe</li>
        <li><strong>Local Events</strong> - Dog-friendly events and activities in your area</li>
      </ul>

      <h3>Join Our Community</h3>

      <p>We encourage you to comment on our posts with your experiences and share photos of your dogs at local parks! Stay tuned for more great content about California's best dog parks! 🐕</p>
    `,
    excerpt: "Welcome to our California Dog Parks blog! We're excited to share tips, reviews, and stories about the best dog parks across California.",
    date: "2024-12-08T10:00:00Z",
    modified: "2024-12-08T10:00:00Z",
    author: {
      id: 1,
      name: "California Dog Parks Team",
      url: "https://californiadogparks.com",
      description: "Dedicated to helping dog owners find the best parks in California",
      link: "https://californiadogparks.com/author/california-dog-parks-team",
      slug: "california-dog-parks-team",
      avatar_urls: {
        '96': "https://via.placeholder.com/96x96/e0e0e0/cccccc?text=CDP",
        '48': "https://via.placeholder.com/48x48/e0e0e0/cccccc?text=CDP",
        '24': "https://via.placeholder.com/24x24/e0e0e0/cccccc?text=CDP"
      }
    },
    categories: [
      {
        id: 1,
        name: "Announcements",
        slug: "announcements",
        count: 1,
        description: "Blog announcements and updates",
        link: "https://californiadogparks.com/category/announcements",
        taxonomy: "category",
        parent: 0,
        meta: {}
      }
    ],
    tags: [
      {
        id: 1,
        name: "california dog parks",
        slug: "california-dog-parks",
        count: 1,
        description: "Dog parks in California",
        link: "https://californiadogparks.com/tag/california-dog-parks",
        taxonomy: "post_tag",
        meta: {}
      },
      {
        id: 2,
        name: "dog training",
        slug: "dog-training",
        count: 1,
        description: "Dog training tips and techniques",
        link: "https://californiadogparks.com/tag/dog-training",
        taxonomy: "post_tag",
        meta: {}
      },
      {
        id: 3,
        name: "pet care",
        slug: "pet-care",
        count: 1,
        description: "Pet care and health",
        link: "https://californiadogparks.com/tag/pet-care",
        taxonomy: "post_tag",
        meta: {}
      }
    ],
    featuredImage: {
      id: 1,
      date: "2024-12-08T10:00:00Z",
      slug: "california-dog-parks-featured",
      type: "attachment",
      link: "https://californiadogparks.com/california-dog-parks-featured",
      title: {
        rendered: "California Dog Parks"
      },
      author: 1,
      caption: {
        rendered: "California Dog Parks featured image"
      },
      alt_text: "California Dog Parks",
      media_type: "image",
      mime_type: "image/jpeg",
      source_url: "https://via.placeholder.com/1200x630/4a90e2/ffffff?text=California+Dog+Parks",
      media_details: {
        width: 1200,
        height: 630,
        file: "california-dog-parks-featured.jpg"
      }
    },
    link: "https://californiadogparks.com/blog/welcome-to-california-dog-parks",
    status: "publish",
    commentStatus: "open"
  },
  {
    id: 2,
    title: "Top 10 Dog Parks in Los Angeles",
    slug: "top-10-dog-parks-los-angeles",
    content: `
      <h2>Discover LA's Best Dog Parks</h2>

      <p>Los Angeles offers some fantastic dog parks where your furry friends can run, play, and socialize. Here are our top 10 picks:</p>

      <h3>1. Runyon Canyon Park</h3>
      <p>Popular with locals, this park offers great trails and plenty of space for dogs to explore. Perfect for active dogs who love hiking.</p>

      <h3>2. Griffith Park Dog Park</h3>
      <p>A dedicated off-leash area within the iconic Griffith Park. Separate areas for small and large dogs ensure everyone has a great time.</p>

      <h3>3. Silver Lake Dog Park</h3>
      <p>A beloved neighborhood park with a fenced dog area, water features, and friendly regulars. Great for socializing your pup.</p>

      <h3>4. Elysian Park</h3>
      <p>Historic park with dog-friendly areas and beautiful scenery. Perfect for leisurely walks with your furry companion.</p>

      <p><em>Read our full guide for detailed information about each park, including parking, facilities, and peak times to visit!</em></p>
    `,
    excerpt: "Discover the top 10 dog parks in Los Angeles where your furry friends can run, play, and socialize safely.",
    date: "2024-12-07T14:30:00Z",
    modified: "2024-12-07T14:30:00Z",
    author: {
      id: 1,
      name: "California Dog Parks Team",
      url: "https://californiadogparks.com",
      description: "Dedicated to helping dog owners find the best parks in California",
      link: "https://californiadogparks.com/author/california-dog-parks-team",
      slug: "california-dog-parks-team",
      avatar_urls: {
        '96': "https://via.placeholder.com/96x96/e0e0e0/cccccc?text=CDP",
        '48': "https://via.placeholder.com/48x48/e0e0e0/cccccc?text=CDP",
        '24': "https://via.placeholder.com/24x24/e0e0e0/cccccc?text=CDP"
      }
    },
    categories: [
      {
        id: 2,
        name: "Park Reviews",
        slug: "park-reviews",
        count: 3,
        description: "Reviews of dog parks across California",
        link: "https://californiadogparks.com/category/park-reviews",
        taxonomy: "category",
        parent: 0,
        meta: {}
      },
      {
        id: 3,
        name: "Los Angeles",
        slug: "los-angeles",
        count: 1,
        description: "Dog parks in Los Angeles area",
        link: "https://californiadogparks.com/category/los-angeles",
        taxonomy: "category",
        parent: 0,
        meta: {}
      }
    ],
    tags: [
      {
        id: 4,
        name: "los angeles",
        slug: "los-angeles",
        count: 1,
        description: "Los Angeles dog parks",
        link: "https://californiadogparks.com/tag/los-angeles",
        taxonomy: "post_tag",
        meta: {}
      },
      {
        id: 5,
        name: "dog parks",
        slug: "dog-parks",
        count: 2,
        description: "General dog park information",
        link: "https://californiadogparks.com/tag/dog-parks",
        taxonomy: "post_tag",
        meta: {}
      }
    ],
    featuredImage: {
      id: 2,
      date: "2024-12-07T14:30:00Z",
      slug: "la-dog-parks-featured",
      type: "attachment",
      link: "https://californiadogparks.com/la-dog-parks-featured",
      title: {
        rendered: "LA Dog Parks"
      },
      author: 1,
      caption: {
        rendered: "Los Angeles Dog Parks featured image"
      },
      alt_text: "Los Angeles Dog Parks",
      media_type: "image",
      mime_type: "image/jpeg",
      source_url: "https://via.placeholder.com/1200x630/3498db/ffffff?text=LA+Dog+Parks",
      media_details: {
        width: 1200,
        height: 630,
        file: "la-dog-parks-featured.jpg"
      }
    },
    link: "https://californiadogparks.com/blog/top-10-dog-parks-los-angeles",
    status: "publish",
    commentStatus: "open"
  },
  {
    id: 3,
    title: "Dog Training Tips for Park Visits",
    slug: "dog-training-tips-park-visits",
    content: `
      <h2>Make Every Park Visit a Success</h2>

      <p>Proper training can make park visits more enjoyable for both you and your dog. Here are our top training tips:</p>

      <h3>Before You Go</h3>
      <ul>
        <li>Exercise your dog at home to reduce excess energy</li>
        <li>Bring plenty of water and treats</li>
        <li>Practice basic commands (sit, stay, come)</li>
        <li>Check park rules and requirements</li>
      </ul>

      <h3>At the Park</h3>
      <ul>
        <li>Keep your dog on a leash until you're in designated off-leash areas</li>
        <li>Practice recall commands in a safe environment</li>
        <li>Monitor your dog's body language and stress levels</li>
        <li>Clean up after your dog (bring bags!)</li>
      </ul>

      <h3>Socialization Tips</h3>
      <ul>
        <li>Start with less busy times for nervous dogs</li>
        <li>Reward calm behavior around other dogs</li>
        <li>Watch for signs of stress or aggression</li>
        <li>End on a positive note</li>
      </ul>

      <p><em>Remember: Every dog is different. Go at your dog's pace and celebrate small victories!</em></p>
    `,
    excerpt: "Essential dog training tips to make park visits safe and enjoyable for you and your furry friend.",
    date: "2024-12-06T09:15:00Z",
    modified: "2024-12-06T09:15:00Z",
    author: {
      id: 1,
      name: "California Dog Parks Team",
      url: "https://californiadogparks.com",
      description: "Dedicated to helping dog owners find the best parks in California",
      link: "https://californiadogparks.com/author/california-dog-parks-team",
      slug: "california-dog-parks-team",
      avatar_urls: {
        '96': "https://via.placeholder.com/96x96/e0e0e0/cccccc?text=CDP",
        '48': "https://via.placeholder.com/48x48/e0e0e0/cccccc?text=CDP",
        '24': "https://via.placeholder.com/24x24/e0e0e0/cccccc?text=CDP"
      }
    },
    categories: [
      {
        id: 4,
        name: "Dog Training",
        slug: "dog-training",
        count: 2,
        description: "Training tips and techniques",
        link: "https://californiadogparks.com/category/dog-training",
        taxonomy: "category",
        parent: 0,
        meta: {}
      },
      {
        id: 5,
        name: "Tips & Guides",
        slug: "tips-guides",
        count: 1,
        description: "Helpful guides and tips",
        link: "https://californiadogparks.com/category/tips-guides",
        taxonomy: "category",
        parent: 0,
        meta: {}
      }
    ],
    tags: [
      {
        id: 6,
        name: "training",
        slug: "training",
        count: 1,
        description: "Training techniques",
        link: "https://californiadogparks.com/tag/training",
        taxonomy: "post_tag",
        meta: {}
      },
      {
        id: 7,
        name: "socialization",
        slug: "socialization",
        count: 1,
        description: "Dog socialization tips",
        link: "https://californiadogparks.com/tag/socialization",
        taxonomy: "post_tag",
        meta: {}
      }
    ],
    featuredImage: {
      id: 3,
      date: "2024-12-06T12:00:00Z",
      slug: "dog-training-featured",
      type: "attachment",
      link: "https://californiadogparks.com/dog-training-featured",
      title: {
        rendered: "Dog Training"
      },
      author: 1,
      caption: {
        rendered: "Dog Training featured image"
      },
      alt_text: "Dog Training Tips",
      media_type: "image",
      mime_type: "image/jpeg",
      source_url: "https://via.placeholder.com/1200x630/28a745/ffffff?text=Dog+Training",
      media_details: {
        width: 1200,
        height: 630,
        file: "dog-training-featured.jpg"
      }
    },
    link: "https://californiadogparks.com/blog/dog-training-tips-park-visits",
    status: "publish",
    commentStatus: "open"
  }
];

export const mockCategories = [
  {
    id: 1,
    name: "Announcements",
    slug: "announcements",
    description: "Blog announcements and updates",
    count: 1,
    link: "https://californiadogparks.com/category/announcements",
    taxonomy: "category",
    parent: 0,
    meta: {}
  },
  {
    id: 2,
    name: "Park Reviews",
    slug: "park-reviews",
    description: "Reviews of dog parks across California",
    count: 3,
    link: "https://californiadogparks.com/category/park-reviews",
    taxonomy: "category",
    parent: 0,
    meta: {}
  },
  {
    id: 3,
    name: "Los Angeles",
    slug: "los-angeles",
    description: "Dog parks in Los Angeles area",
    count: 1,
    link: "https://californiadogparks.com/category/los-angeles",
    taxonomy: "category",
    parent: 0,
    meta: {}
  },
  {
    id: 4,
    name: "Dog Training",
    slug: "dog-training",
    description: "Training tips and techniques",
    count: 2,
    link: "https://californiadogparks.com/category/dog-training",
    taxonomy: "category",
    parent: 0,
    meta: {}
  },
  {
    id: 5,
    name: "Tips & Guides",
    slug: "tips-guides",
    description: "Helpful guides and tips",
    count: 1,
    link: "https://californiadogparks.com/category/tips-guides",
    taxonomy: "category",
    parent: 0,
    meta: {}
  }
];

export const mockTags = [
  {
    id: 1,
    name: "california dog parks",
    slug: "california-dog-parks",
    description: "Dog parks in California",
    count: 1,
    link: "https://californiadogparks.com/tag/california-dog-parks",
    taxonomy: "post_tag",
    meta: {}
  },
  {
    id: 2,
    name: "dog training",
    slug: "dog-training",
    description: "Dog training tips and techniques",
    count: 1,
    link: "https://californiadogparks.com/tag/dog-training",
    taxonomy: "post_tag",
    meta: {}
  },
  {
    id: 3,
    name: "pet care",
    slug: "pet-care",
    description: "Pet care and health",
    count: 1,
    link: "https://californiadogparks.com/tag/pet-care",
    taxonomy: "post_tag",
    meta: {}
  },
  {
    id: 4,
    name: "los angeles",
    slug: "los-angeles",
    description: "Los Angeles dog parks",
    count: 1,
    link: "https://californiadogparks.com/tag/los-angeles",
    taxonomy: "post_tag",
    meta: {}
  },
  {
    id: 5,
    name: "dog parks",
    slug: "dog-parks",
    description: "General dog park information",
    count: 2,
    link: "https://californiadogparks.com/tag/dog-parks",
    taxonomy: "post_tag",
    meta: {}
  },
  {
    id: 6,
    name: "training",
    slug: "training",
    description: "Training techniques",
    count: 1,
    link: "https://californiadogparks.com/tag/training",
    taxonomy: "post_tag",
    meta: {}
  },
  {
    id: 7,
    name: "socialization",
    slug: "socialization",
    description: "Dog socialization tips",
    count: 1,
    link: "https://californiadogparks.com/tag/socialization",
    taxonomy: "post_tag",
    meta: {}
  }
];