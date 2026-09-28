export const AUTHOR = {
  name: 'Nguyễn Ngọc Tâm',
  givenName: 'Tâm',
  additionalName: 'Ngọc',
  familyName: 'Nguyễn',
  alternateNames: ['Nguyen Ngoc Tam', 'Ngọc Tâm Dev', 'Tâm Dev', 'Nguyen Ngoc Tam Dev'],
  brandName: 'Ngọc Tâm Dev',
  identifier: 'ngoc-tam-dev',
  jobTitle: 'Full-stack Developer',
  roles: ['Full-stack Developer', 'PHP Developer', 'Backend Developer'],
  location: 'Ho Chi Minh City, Vietnam',
  origin: 'Ninh Thuận, Vietnam',
  description: 'Nguyễn Ngọc Tâm (Ngọc Tâm Dev) là Full-stack Developer quê Ninh Thuận, hiện làm việc tại South Telecom ở TP.HCM, tập trung vào PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC, REST API và các hệ thống backend/realtime.',
  knowsAbout: [
    'PHP', 'Laravel', 'CodeIgniter', 'JavaScript', 'TypeScript', 'MongoDB',
    'PostgreSQL', 'SQL Server', 'Redis', 'WebSocket', 'WebRTC', 'REST API',
    'CRM Integration', 'Docker', 'Kubernetes', 'AWS', 'Nginx', 'Linux',
  ],
  sameAs: [
    'https://linkedin.com/in/ngoctam1609',
    'https://github.com/ngoctam169',
  ],
  employment: {
    organization: 'South Telecom',
    role: 'Full-stack Developer',
    startDate: '2022-07',
  },
  education: {
    organization: 'Industrial University of Ho Chi Minh City',
    field: 'Information Technology',
    startDate: '2019-09',
    endDate: '2022-02',
  },
}

export function personEntity(siteUrl) {
  return {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    identifier: AUTHOR.identifier,
    name: AUTHOR.name,
    givenName: AUTHOR.givenName,
    additionalName: AUTHOR.additionalName,
    familyName: AUTHOR.familyName,
    alternateName: AUTHOR.alternateNames,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.description,
    disambiguatingDescription: 'Nguyễn Ngọc Tâm (Ngọc Tâm Dev), Full-stack Developer quê Ninh Thuận, hiện làm việc tại TP.HCM và South Telecom.',
    url: `${siteUrl}/about`,
    mainEntityOfPage: { '@id': `${siteUrl}/about#profilepage` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ho Chi Minh City',
      addressCountry: 'VN',
    },
    worksFor: {
      '@type': 'Organization',
      name: AUTHOR.employment.organization,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: AUTHOR.education.organization,
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: AUTHOR.jobTitle,
      skills: AUTHOR.knowsAbout.join(', '),
      occupationLocation: {
        '@type': 'City',
        name: 'Ho Chi Minh City',
      },
    },
    knowsAbout: AUTHOR.knowsAbout,
    subjectOf: {
      '@type': 'Article',
      name: 'Nguyễn Ngọc Tâm Ninh Thuận: Vì sao một chàng trai rời quê vào Sài Gòn chọn nghề Dev?',
      url: `${siteUrl}/blog#nguyen-ngoc-tam-ninh-thuan`,
    },
    sameAs: AUTHOR.sameAs,
  }
}
