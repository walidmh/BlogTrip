import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPostsBlog } from '../../lib/api-blog'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import React from 'react';

export default function Post({ post, morePosts, preview }) {
  const [enable,SetEnable] = React.useState(true);
  function loadComments(){
    SetEnable(false);
      (function () {
        var d = document, s = d.createElement('script')
        s.src = 'https://ghostcms-backend-blog.disqus.com/embed.js'
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s)
      })();
  }

  const router = useRouter()
  if (!router.isFallback && !post.post[0]?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.post[0].title} | {CMS_NAME}
                </title>
                <meta property="og:image" content={post.post[0].url} />
              </Head>
              <PostHeader
                title={post.post[0].title}
                coverImage={post.post[0].feature_image}
                date={post.post[0].published_at}
                author={post.post[0].primary_author}
              />
              <PostBody content={post.post[0].html} />
              {enable && (
                <p className="cursor-pointer max-w-2xl mx-auto font-bold" onClick={loadComments}>Afficher les commentaires</p>
              )}
              <div id="disqus_thread"></div>
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug)
  return {
    props: {
      post: {post},
      revalidate: 10
  }
}
}

export async function getStaticPaths() {
  const posts = await getAllPostsBlog()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
