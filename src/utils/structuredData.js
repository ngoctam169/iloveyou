import { AUTHOR, personEntity } from '../data/author.js'
import { blogPostMeta } from '../data/blogMeta.js'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '../data/seo.js'

const homeFaq = [
  ['NT có phù hợp với người mới bắt đầu không?','Có. Mỗi ngôn ngữ có một level nền tảng và toàn bộ level đều có thể mở.'],
  ['Tôi có cần tạo tài khoản không?','Không. Tiến độ học của phiên bản hiện tại được lưu trong trình duyệt.'],
  ['NT có nội dung TOEIC và IELTS không?','Có. NT có khu luyện TOEIC Listening và Reading cùng IELTS bốn kỹ năng.'],
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
  const organizationId = `${siteUrl}/#organization`
  const personId = `${siteUrl}/#person`
  const graph = [
    { '@type':'WebSite', '@id':websiteId, url:`${siteUrl}/`, name:SITE_NAME, inLanguage:['vi','en'], potentialAction:{ '@type':'SearchAction', target:`${siteUrl}/search?q={search_term_string}`, 'query-input':'required name=search_term_string' } },
    { '@type':'EducationalOrganization', '@id':organizationId, name:SITE_NAME, url:`${siteUrl}/`, logo:`${siteUrl}/icon-512.png` },
  ]

  if (meta.pageType === 'profile') {
    graph.push({ '@type':'ProfilePage', '@id':`${canonical}#profilepage`, url:canonical, name:meta.title, description:meta.description, mainEntity:{ '@id':personId }, isPartOf:{ '@id':websiteId }, inLanguage:'vi' })
    graph.push(personEntity(siteUrl))
  } else {
    graph.push({ '@type':'WebPage', '@id':`${canonical}#webpage`, url:canonical, name:meta.title, description:meta.description, isPartOf:{ '@id':websiteId }, ...(meta.pageType === 'article' ? { author:{ '@id':personId } } : {}), inLanguage:'vi' })
  }

  if (path === '/') {
    graph.push(personEntity(siteUrl))
    graph.push({ '@type':'FAQPage', mainEntity:homeFaq.map(([name,text]) => ({ '@type':'Question', name, acceptedAnswer:{ '@type':'Answer', text } })) })
  }

  if (meta.pageType === 'blog') {
    graph.push(personEntity(siteUrl))
    graph.push({ '@type':'Blog', '@id':`${canonical}#blog`, url:canonical, name:meta.title, description:meta.description, author:{ '@id':personId }, isPartOf:{ '@id':websiteId }, blogPost:blogPostMeta.map((post) => ({ '@id':`${siteUrl}/blog/${post.slug}#article` })), inLanguage:'vi' })
  }

  if (meta.pageType === 'article') {
    graph.push(personEntity(siteUrl))
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
      publisher:{ '@id':organizationId },
      isPartOf:{ '@id':`${siteUrl}/blog#blog` },
      inLanguage:'vi',
    })
  }

  if (breadcrumbs.length > 1) graph.push({ '@type':'BreadcrumbList', itemListElement:breadcrumbs.map((item,index) => ({ '@type':'ListItem', position:index + 1, name:item.name, item:`${siteUrl}${item.path}` })) })
  if (/^\/(english|chinese|japanese|korean)\/[^/]+$/.test(path)) graph.push({ '@type':'Course', name:meta.title.replace(' | NT',''), description:meta.description, provider:{ '@id':organizationId }, url:canonical, inLanguage:'vi' })

  return { '@context':'https://schema.org', '@graph':graph }
}
