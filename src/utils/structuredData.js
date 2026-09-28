import { AUTHOR, personEntity } from '../data/author.js'
import { blogPostMeta } from '../data/blogMeta.js'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '../data/seo.js'

export function defaultBreadcrumbs(path, meta) {
  if (meta.pageType === 'article') return [
    { name:'Trang chủ',path:'/' },
    { name:'Blog Nguyễn Ngọc Tâm',path:'/blog' },
    { name:meta.article.category,path:'/blog' },
    { name:meta.article.title,path },
  ]
  if (path === '/blog') return [{ name:'Trang chủ',path:'/' },{ name:'Blog Nguyễn Ngọc Tâm',path:'/blog' }]
  if (path === '/about') return [{ name:'Trang chủ',path:'/' },{ name:`Nguyễn Ngọc Tâm – Full-stack Developer`,path:'/about' }]
  return []
}

export function buildStructuredData({ siteUrl, meta, path, breadcrumbs = defaultBreadcrumbs(path,meta) }) {
  const canonical = `${siteUrl}${path}`
  const websiteId = `${siteUrl}/#website`
  const personId = `${siteUrl}/#person`
  const graph = [
    {
      '@type':'WebSite',
      '@id':websiteId,
      url:`${siteUrl}/`,
      name:SITE_NAME,
      alternateName:['Nguyễn Ngọc Tâm','Ngoc Tam Dev','NT'],
      description:'Website cá nhân và các project của Nguyễn Ngọc Tâm (Ngọc Tâm Dev), Full-stack Developer quê Ninh Thuận, hiện làm việc tại TP.HCM.',
      inLanguage:['vi','en'],
      creator:{ '@id':personId },
      author:{ '@id':personId },
      about:{ '@id':personId },
      potentialAction:{ '@type':'SearchAction', target:`${siteUrl}/search?q={search_term_string}`, 'query-input':'required name=search_term_string' },
    },
  ]

  if (meta.pageType === 'profile') {
    graph.push({
      '@type':'ProfilePage',
      '@id':`${canonical}#profilepage`,
      url:canonical,
      name:meta.title,
      description:meta.description,
      mainEntity:{ '@id':personId },
      isPartOf:{ '@id':websiteId },
      inLanguage:'vi',
    })
    graph.push(personEntity(siteUrl))
  } else {
    graph.push({
      '@type':'WebPage',
      '@id':`${canonical}#webpage`,
      url:canonical,
      name:meta.title,
      description:meta.description,
      isPartOf:{ '@id':websiteId },
      ...(path === '/' || meta.pageType === 'blog' || meta.pageType === 'article' ? {
        about:{ '@id':personId },
        author:{ '@id':personId },
      } : {}),
      inLanguage:'vi',
    })
  }

  if ((path === '/' || meta.pageType === 'blog' || meta.pageType === 'article') && meta.pageType !== 'profile') {
    graph.push(personEntity(siteUrl))
  }

  if (meta.pageType === 'blog') {
    graph.push({
      '@type':'Blog',
      '@id':`${canonical}#blog`,
      url:canonical,
      name:meta.title,
      description:meta.description,
      author:{ '@id':personId },
      creator:{ '@id':personId },
      publisher:{ '@id':personId },
      isPartOf:{ '@id':websiteId },
      blogPost:blogPostMeta.map((post) => ({ '@id':`${siteUrl}/blog/${post.slug}#article` })),
      inLanguage:'vi',
    })
  }

  if (meta.pageType === 'article') {
    graph.push({
      '@type':'BlogPosting',
      '@id':`${canonical}#article`,
      headline:meta.article.title,
      description:meta.article.description,
      image:`${siteUrl}${DEFAULT_OG_IMAGE}`,
      datePublished:meta.article.datePublished,
      dateModified:meta.article.dateModified,
      mainEntityOfPage:{ '@id':`${canonical}#webpage` },
      url:canonical,
      keywords:[...meta.article.tags, AUTHOR.name, AUTHOR.brandName],
      articleSection:meta.article.category,
      ...(meta.article.slug === 'nguyen-ngoc-tam-ninh-thuan' ? { about:{ '@id':personId } } : {}),
      author:{ '@id':personId },
      creator:{ '@id':personId },
      publisher:{ '@id':personId },
      isPartOf:{ '@id':`${siteUrl}/blog#blog` },
      inLanguage:'vi',
    })
  }

  if (breadcrumbs.length > 1) {
    graph.push({
      '@type':'BreadcrumbList',
      itemListElement:breadcrumbs.map((item,index) => ({
        '@type':'ListItem',
        position:index + 1,
        name:item.name,
        item:`${siteUrl}${item.path}`,
      })),
    })
  }

  if (/^\/(english|chinese|japanese|korean)\/[^/]+$/.test(path)) {
    graph.push({
      '@type':'Course',
      name:meta.title.replace(' | NT',''),
      description:meta.description,
      provider:{ '@id':personId },
      url:canonical,
      inLanguage:'vi',
    })
  }

  return { '@context':'https://schema.org', '@graph':graph }
}
