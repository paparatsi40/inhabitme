import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { ArrowLeft, Clock, Calendar, Tag, User } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllSlugs, getPostBySlug } from '@/lib/blog'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const slugs = getAllSlugs(locale)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(slug, locale)

  if (!post) return {}

  return {
    title: `${post.title} | InhabitMe Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

// MDX component overrides — Tailwind prose-like styling without the plugin
const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-black text-gray-900 mt-10 mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-100" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-gray-700 leading-relaxed mb-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-none space-y-2 my-4 pl-0" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside space-y-2 my-4 pl-4 text-gray-700" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className="flex items-start gap-2.5 text-gray-700 leading-relaxed before:content-[''] before:mt-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-blue-500 before:shrink-0"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-gray-900" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-gray-700" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-blue-600 hover:text-blue-700 underline underline-offset-2"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 my-4 text-gray-700 italic rounded-r-xl"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto my-6 text-sm"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-gray-50" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-gray-200 px-4 py-2.5 text-left font-semibold text-gray-900"
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-gray-200 px-4 py-2.5 text-gray-700" {...props} />
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'blogPage' })

  const post = getPostBySlug(slug, locale)

  if (!post) notFound()

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToBlog')}
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </span>
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} {t('minRead')}
            </span>
          )}
        </div>

        {/* MDX Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Footer CTA */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-r-xl p-6">
          <p className="text-gray-700 font-medium mb-3">{t('ctaText')}</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </article>
    </div>
  )
}
