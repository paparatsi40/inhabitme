/**
 * Server-side markdown → React element pipeline.
 *
 * Uses unified + remark-parse + remark-rehype + hast-util-to-jsx-runtime.
 * This avoids next-mdx-remote's `new Function()` dynamic eval which can
 * fail in certain Next.js / Vercel RSC environments.
 */

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import React from 'react'

export async function markdownToReact(
  markdown: string,
  components?: Partial<Components>
): Promise<React.ReactElement> {
  const processor = unified().use(remarkParse).use(remarkRehype)
  const hast = await processor.run(processor.parse(markdown))

  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components,
  }) as React.ReactElement
}
