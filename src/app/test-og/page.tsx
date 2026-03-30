import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Open Graph Image Tester',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OpenGraphTester() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com'
  
  const testImages = [
    {
      title: 'Default (Homepage)',
      url: `${baseUrl}/api/og`,
    },
    {
      title: 'Madrid',
      url: `${baseUrl}/api/og?city=madrid&title=Medium-term rentals in Madrid`,
    },
    {
      title: 'Barcelona',
      url: `${baseUrl}/api/og?city=barcelona&title=Medium-term rentals in Barcelona`,
    },
    {
      title: 'Valencia',
      url: `${baseUrl}/api/og?city=valencia&title=Medium-term rentals in Valencia`,
    },
    {
      title: 'Property Example',
      url: `${baseUrl}/api/og?city=madrid&title=Cozy Studio in Malasaña&subtitle=Modern apartment with workspace and fast WiFi`,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Open Graph Image Tester
          </h1>
          <p className="text-gray-600">
            Preview of dynamically generated Open Graph images for social media sharing
          </p>
        </div>

        <div className="space-y-8">
          {testImages.map((image, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {image.title}
                </h2>
                <div className="bg-gray-100 p-3 rounded-md">
                  <code className="text-sm text-gray-700 break-all">
                    {image.url}
                  </code>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-auto"
                  style={{ aspectRatio: '1200/630' }}
                />
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Open in New Tab
                </a>
                <a
                  href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(image.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
                >
                  Test on Facebook
                </a>
                <a
                  href={`https://cards-dev.twitter.com/validator?url=${encodeURIComponent(image.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition"
                >
                  Test on Twitter
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-3">
            🧪 How to Use
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Preview all generated images above</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Click &quot;Test on Facebook&quot; or &quot;Test on Twitter&quot; to validate how they appear on social media</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Share a page URL (e.g., /en/madrid) on social media to see the actual OG image in action</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-yellow-900 mb-3">
            📝 API Parameters
          </h3>
          <div className="space-y-3 text-yellow-800">
            <div>
              <strong>city:</strong> <code className="bg-yellow-100 px-2 py-1 rounded">madrid</code>,{' '}
              <code className="bg-yellow-100 px-2 py-1 rounded">barcelona</code>,{' '}
              <code className="bg-yellow-100 px-2 py-1 rounded">valencia</code>, or{' '}
              <code className="bg-yellow-100 px-2 py-1 rounded">default</code>
            </div>
            <div>
              <strong>title:</strong> Main heading text (optional)
            </div>
            <div>
              <strong>subtitle:</strong> Secondary text below title (optional)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
