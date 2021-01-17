const {BLOG_URL, CONTENT_API_KEY} = process.env
export async function getAllPostsBlog(){
    const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&include=tags,authors`)
    .then((res) => res.json())
    const posts = res.posts.map((post) => post)
    return posts;
}

export async function getPostBySlug(SLUG){
    const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/slug/${SLUG}/?key=${CONTENT_API_KEY}&include=tags,authors`)
    .then((res) => res.json())
    const posts = res.posts.map((post) => post)
    //console.log(posts); 
    return posts;
}