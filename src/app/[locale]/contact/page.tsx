import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getTranslations } from 'next-intl/server';
import { 
  Mail, MapPin, Phone, MessageCircle, Send, ArrowLeft
} from 'lucide-react';

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-lg border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
                </svg>
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                inhabitme
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-purple-200 rounded-2xl mb-6">
            <MessageCircle className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">{t('sendMessageTitle')}</CardTitle>
                <CardDescription>
                  {t('sendMessageDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action="https://formspree.io/f/your-form-id" method="POST" className="space-y-6">
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fullNameLabel')}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t('fullNamePlaceholder')}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('emailLabel')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('subjectLabel')}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder={t('subjectPlaceholder')}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('messageLabel')}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={t('messagePlaceholder')}
                      required
                      rows={6}
                      className="w-full resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t('sendButton')}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    {t('requiredFieldsNote')}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            
            {/* Email */}
            <Card className="border-2 border-blue-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t('emailCardTitle')}</h3>
                    <a 
                      href="mailto:contact@inhabitme.com"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      contact@inhabitme.com
                    </a>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('emailCardResponseTime')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-2 border-purple-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t('supportCardTitle')}</h3>
                    <a 
                      href="mailto:support@inhabitme.com"
                      className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                      support@inhabitme.com
                    </a>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('supportCardDescription')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-2 border-green-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t('locationCardTitle')}</h3>
                    <p className="text-sm text-gray-600">
                      {t('locationCardCity')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('locationCardRemote')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="border-2 border-orange-100 shadow-sm bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{t('faqCardTitle')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('faqCardDescription')}
                </p>
                <Link href="/faq">
                  <Button variant="outline" className="w-full">
                    {t('faqButton')}
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>

        </div>

      </main>
    </div>
  );
}
