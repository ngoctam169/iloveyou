export const blogPostMeta = [
  {
    slug: 'nguyen-ngoc-tam-ninh-thuan',
    title: 'Từ Ninh Thuận vào Sài Gòn: mình chỉ định học một cái nghề, rồi ở lại với nghề Dev đến giờ',
    seoTitle: 'Nguyễn Ngọc Tâm Ninh Thuận | Vì sao chọn nghề Dev?',
    description: 'Từ một quyết định rất bình thường là học một cái nghề để tự lo cho mình, mình rời Ninh Thuận vào Sài Gòn rồi ở lại với nghề Dev qua những lần học, vấp và tự mò cách giải quyết vấn đề.',
    excerpt: 'Mình vào Sài Gòn chỉ với ý nghĩ học một cái nghề để kiếm sống. Vài năm sau, chính những con bug, những lần mò log và những hệ thống mình từng làm lại là lý do giữ mình ở lại với nghề Dev.',
    category: 'Hành trình cá nhân',
    tags: ['Nguyễn Ngọc Tâm', 'Ninh Thuận', 'South Telecom', '8D JSC', 'Full-stack Developer'],
    datePublished: '2026-09-28',
    dateModified: '2026-10-02',
    readingTime: '8 phút đọc',
  },
  {
    slug: 'php-mongodb-performance',
    title: 'Tối ưu hiệu năng PHP và MongoDB cho hệ thống có lượng request lớn',
    seoTitle: 'Tối ưu PHP và MongoDB cho tải lớn | Nguyễn Ngọc Tâm',
    description: 'Cách đo bottleneck, thiết kế index MongoDB, tối ưu PHP-FPM, cache Redis và kiểm soát truy vấn khi hệ thống PHP xử lý lượng request lớn thực tế.',
    excerpt: 'Một quy trình thực tế để tìm bottleneck, đọc execution plan và tối ưu từ request PHP đến truy vấn MongoDB mà không đánh đổi tính đúng đắn.',
    category: 'PHP & Database',
    tags: ['PHP', 'MongoDB', 'Redis', 'Performance'],
    datePublished: '2026-09-28',
    dateModified: '2026-10-02',
    readingTime: '14 phút đọc',
  },
  {
    slug: 'websocket-realtime-system',
    title: 'WebSocket hoạt động như thế nào trong hệ thống realtime?',
    seoTitle: 'WebSocket trong hệ thống realtime | Nguyễn Ngọc Tâm',
    description: 'Giải thích WebSocket handshake, connection lifecycle, heartbeat, reconnect, backpressure và cách scale hệ thống realtime qua nhiều server production.',
    excerpt: 'Từ HTTP Upgrade đến heartbeat, backpressure và horizontal scaling: những phần cần hiểu trước khi đưa WebSocket vào production.',
    category: 'Realtime Systems',
    tags: ['WebSocket', 'Realtime', 'Redis', 'Backend'],
    datePublished: '2026-09-28',
    dateModified: '2026-10-02',
    readingTime: '13 phút đọc',
  },
  {
    slug: 'webrtc-video-call',
    title: 'WebRTC là gì? Cách xây dựng video call realtime trên web',
    seoTitle: 'WebRTC và video call realtime trên web | Nguyễn Ngọc Tâm',
    description: 'Tìm hiểu signaling, SDP, ICE, STUN/TURN, bảo mật media và lựa chọn P2P hoặc SFU khi xây dựng video call WebRTC ổn định trong production.',
    excerpt: 'WebRTC truyền media trực tiếp, nhưng một sản phẩm video call còn cần signaling, TURN, topology phù hợp và hệ thống quan sát đủ tốt.',
    category: 'WebRTC',
    tags: ['WebRTC', 'Video Call', 'Janus', 'Jitsi'],
    datePublished: '2026-09-28',
    dateModified: '2026-10-02',
    readingTime: '14 phút đọc',
  },
  {
    slug: 'laravel-queue-redis',
    title: 'Laravel Queue và Redis: xử lý background job hiệu quả',
    seoTitle: 'Laravel Queue và Redis cho background job | Nguyễn Ngọc Tâm',
    description: 'Thiết kế Laravel Queue với Redis an toàn bằng idempotency, retry, backoff, timeout, monitoring và chiến lược xử lý job lỗi trong production.',
    excerpt: 'Queue chỉ thực sự đáng tin cậy khi job có tính idempotent, timeout và retry được cấu hình đúng, đồng thời worker được giám sát trong production.',
    category: 'Laravel',
    tags: ['Laravel', 'Redis', 'Queue', 'PHP'],
    datePublished: '2026-09-28',
    dateModified: '2026-10-02',
    readingTime: '13 phút đọc',
  },
]

export const personalStoryMeta = blogPostMeta.find((post) => post.slug === 'nguyen-ngoc-tam-ninh-thuan')

export const latestBlogPosts = blogPostMeta
  .filter((post) => post.slug !== 'nguyen-ngoc-tam-ninh-thuan')
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished))

export const findBlogMeta = (slug) => blogPostMeta.find((post) => post.slug === slug)
