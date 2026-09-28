export const AUTHOR = {
  name: 'Nguyễn Ngọc Tâm',
  alternateNames: ['Nguyen Ngoc Tam', 'Ngọc Tâm Dev', 'Tâm Dev', 'Nguyen Ngoc Tam Dev'],
  brandName: 'Ngọc Tâm Dev',
  jobTitle: 'Full-stack Developer',
  roles: ['Full-stack Developer', 'PHP Developer', 'Backend Developer', 'Realtime Systems Developer'],
  location: 'Ho Chi Minh City, Vietnam',
  description: 'Nguyễn Ngọc Tâm (Ngọc Tâm Dev) là Full-stack Developer tại South Telecom ở TP.HCM, tập trung vào PHP, Laravel, MongoDB, Redis, WebSocket, WebRTC, REST API và các hệ thống backend/realtime.',
  knowsAbout: [
    'PHP', 'Laravel', 'CodeIgniter', 'JavaScript', 'TypeScript', 'MongoDB',
    'PostgreSQL', 'SQL Server', 'Redis', 'WebSocket', 'WebRTC', 'REST API',
    'CRM Integration', 'Docker', 'Kubernetes', 'AWS', 'Nginx', 'Linux',
    'Realtime Systems', 'Backend Development',
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
    name: AUTHOR.name,
    alternateName: AUTHOR.alternateNames,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.description,
    url: `${siteUrl}/about`,
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
      occupationLocation: {
        '@type': 'City',
        name: 'Ho Chi Minh City',
      },
    },
    knowsAbout: AUTHOR.knowsAbout,
    sameAs: AUTHOR.sameAs,
  }
}
