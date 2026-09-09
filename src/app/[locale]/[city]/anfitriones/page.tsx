/**
 * Alias en español de /[city]/hosts → /es/madrid/anfitriones
 * (next-intl routing no usa `pathnames`, así que se duplica la ruta y se re-exporta.)
 */
export { default, generateMetadata, generateStaticParams } from '../hosts/page'
