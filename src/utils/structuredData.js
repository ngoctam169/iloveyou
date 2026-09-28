import { AUTHOR, personEntity } from '../data/author.js'
import { blogPostMeta } from '../data/blogMeta.js'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '../data/seo.js'

const homeFaq = [
  ['Nguyễn Ngọc Tâm là ai?','Nguyễn Ngọc Tâm, còn sử dụng developer branding Ngọc Tâm Dev, là Full-stack Developer tại South Telecom ở TP.HCM.'],
  ['Nguyễn Ngọc Tâm làm về công nghệ gì?','Trọng tâm kỹ thuật gồm PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC, REST API và các hệ thống backend/realtime.'],
  ['Ngọc Tâm Dev có viết bài kỹ thuật không?','Có. Blog tập trung vào PHP, MongoDB, Laravel Queue, Redis, WebSocket, WebRTC và các bài toán production thực tế.'],
]

export function defaultBreadcrumbs(path, meta) {
  if (meta.pageType === 'article') return [
    { name:'Trang chủ',path:'/' },
    { name:'Blog',path:'/blog' },
    { name:meta.article.category,path:'/blog' },
    { name:meta.article.title,path },
  ]
  if (path === '/blog') return [{ name:'Trang chủ',path:'/' },{ name:'Blog',path:'/blog' }]
  if (path === '/about') return [{ name:'Trang chủ',path:'/' },{ name:`About ${AUTHOR.name}`,path:'/about' }]
  return []
}

export function buildStructuredData({ siteUrl, meta, path, breadcrumbs = defaultBreadcrumbs(path,meta) }) {
  const canonical = `${siteUrl}${path}`
  const websiteId = `${siteUrl}/#website`
  const organizationId = `${siteUrl}/#language-learning-project`
  const personId = `${siteUrl}/#person`
  const graph = [
    {
      '@type':'WebSite',
      '@id':websiteId,
      url:`${siteUrl}/`,
      name:SITE_NAME,
      alternateName:[AUTHOR.name, AUTHOR.brandName, 'Nguyen Ngoc Tam'],
      description:AUTHOR.description,
      inLanguage:['vi','en'],
    },
  ]

  const addPerson = () => {
    if (!graph.some((item) => item['@id'] === personId)) graph.push(personEntity(siteUrl))
  }

  const addLearningOrganization = () => {
    if (!graph.some((item) => item['@id'] === organizationId)) {
      graph.push({
        '@type':'EducationalOrganization',
        '@id':organizationId,
        name:'NT Language Learning',
        url:`${siteUrl}/languages`,
        logo:`${siteUrl}/icon-512.png`,
      })
    }
  }

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
    addPerson()
  } else {
    graph.push({
      '@type':'WebPage',
      '@id':`${canonical}#webpage`,
      url:canonical,
      name:meta.title,
      description:meta.description,
      isPartOf:{ '@id':websiteId },
      ...(path === '/' ? { about:{ '@id':personId }, mainEntity:{ '@id':personId } } : {}),
      ...(meta.pageType === 'article' ? { author:{ '@id':personId } } : {}),
      inLanguage:'vi',
    })
  }

  if (path === '/') {
    addPerson()
    graph.push({
      '@type':'FAQPage',
      mainEntity:homeFaq.map(([name,text]) => ({
        '@type':'Question',
        name,
        acceptedAnswer:{ '@type':'Answer', text },
      })),
    })
  }

  if (meta.pageType === 'blog') {
    addPerson()
    graph.push({
      '@type':'Blog',
      '@id':`${canonical}#blog`,
      url:canonical,
      name:meta.title,
      description:meta.description,
      author:{ '@id':personId },
      publisher:{ '@id':personId },
      isPartOf:{ '@id':websiteId },
      blogPost:blogPostMeta.map((post) => ({ '@id':`${siteUrl}/blog/${post.slug}#article` })),
      inLanguage:'vi',
    })
  }

  if (meta.pageType === 'article') {
    addPerson()
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
      keywords:meta.article.tags,
      author:{ '@id':personId },
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
    addLearningOrganization()
    graph.push({
      '@type':'Course',
      name:meta.title.replace(' | NT',''),
      description:meta.description,
      provider:{ '@id':organizationId },
      url:canonical,
      inLanguage:'vi',
    })
  }

  return { '@context':'https://schema.org', '@graph':graph }
}
