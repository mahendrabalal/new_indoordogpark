const { createClient } = require('next-sanity')

const client = createClient({
  projectId: 'ruuprk8g',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function check() {
  const posts = await client.fetch(`*[_type == "post" && (title match "*2025*" || excerpt match "*2025*" || pt::text(body) match "*2025*")]{
    _id,
    title,
    excerpt
  }`)
  
  console.log(`Found ${posts.length} posts containing 2025:`)
  posts.forEach(post => {
    console.log(`- ${post.title} (ID: ${post._id})`)
  })
}

check().catch(console.error)
