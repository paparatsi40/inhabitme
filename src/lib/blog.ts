import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  coverImage?: string
  readTime?: number
  content: string
  locale: string
}

export type BlogPostMeta = Omit<BlogPost, 'content'>

// ---------------------------------------------------------------------------
// Frontmatter parser — replaces gray-matter to avoid js-yaml v3/v4 conflict
// ---------------------------------------------------------------------------
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const DELIMITER = '---'

  if (!raw.startsWith(DELIMITER)) {
    return { data: {}, content: raw }
  }

  const end = raw.indexOf(DELIMITER, DELIMITER.length)
  if (end === -1) {
    return { data: {}, content: raw }
  }

  const yamlStr = raw.slice(DELIMITER.length, end).trim()
  const content = raw.slice(end + DELIMITER.length).trim()

  let data: Record<string, unknown> = {}
  try {
    const parsed = yaml.load(yamlStr)
    if (parsed && typeof parsed === 'object') {
      data = parsed as Record<string, unknown>
    }
  } catch {
    // malformed frontmatter — return empty data
  }

  return { data, content }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
function getPostsDir(locale: string): string {
  return path.join(BLOG_DIR, locale)
}

function parsePost(filePath: string, slug: string, locale: string): BlogPost {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = parseFrontmatter(raw)

  const dateRaw = data.date
  const dateStr =
    dateRaw instanceof Date
      ? dateRaw.toISOString().slice(0, 10)
      : typeof dateRaw === 'string'
      ? dateRaw
      : ''

  return {
    slug,
    title: typeof data.title === 'string' ? data.title : '',
    description: typeof data.description === 'string' ? data.description : '',
    date: dateStr,
    author: typeof data.author === 'string' ? data.author : '',
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    coverImage: typeof data.coverImage === 'string' ? data.coverImage : undefined,
    readTime: typeof data.readTime === 'number' ? data.readTime : undefined,
    content,
    locale,
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function getAllPosts(locale: string): BlogPostMeta[] {
  const dir = getPostsDir(locale)

  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

  const posts = files.map((file) => {
    const slug = file.replace(/\.(mdx|md)$/, '')
    const { content: _content, ...meta } = parsePost(path.join(dir, file), slug, locale)
    return meta as BlogPostMeta
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string, locale: string): BlogPost | null {
  const dir = getPostsDir(locale)

  for (const ext of ['.mdx', '.md']) {
    const filePath = path.join(dir, `${slug}${ext}`)
    if (fs.existsSync(filePath)) {
      return parsePost(filePath, slug, locale)
    }
  }

  return null
}

export function getAllSlugs(locale: string): string[] {
  const dir = getPostsDir(locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.(mdx|md)$/, ''))
}
