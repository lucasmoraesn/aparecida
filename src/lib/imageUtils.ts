/**
 * Gera URL com width específico para imagens do Pexels
 */
export function getImageUrl(url: string, width: number): string {
  if (!url) return '';

  // Remove parâmetro w existente e adiciona o novo
  const baseUrl = url.split('?')[0];
  const params = new URLSearchParams(url.split('?')[1] || '');
  params.set('w', String(width));

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Gera srcset com diferentes larguras para responsive images
 * Inclui suporte a telas retina (2x)
 */
export function generateSrcSet(url: string): string {
  if (!url) return '';

  const widths = [400, 800, 1200, 1600];
  const srcset = widths
    .map(width => `${getImageUrl(url, width)} ${width}w`)
    .join(', ');

  return srcset;
}

/**
 * Gera srcset com suporte a telas retina
 * Exemplo: 400w, 400w 2x para mobile
 */
export function generateResponsiveSrcSet(url: string): {
  srcSetMobile: string;
  srcSetTablet: string;
  srcSetDesktop: string;
  sizes: string;
} {
  if (!url) {
    return {
      srcSetMobile: '',
      srcSetTablet: '',
      srcSetDesktop: '',
      sizes: '',
    };
  }

  return {
    // Mobile: 400px
    srcSetMobile: `${getImageUrl(url, 400)} 1x, ${getImageUrl(url, 800)} 2x`,
    // Tablet: 800px
    srcSetTablet: `${getImageUrl(url, 800)} 1x, ${getImageUrl(url, 1200)} 2x`,
    // Desktop: 1200px
    srcSetDesktop: `${getImageUrl(url, 1200)} 1x, ${getImageUrl(url, 1600)} 2x`,
    // Media queries para o sizes atributo
    sizes:
      '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw',
  };
}

/**
 * Gera srcset simples com todas as resoluções
 */
export function generateCompleteSrcSet(url: string): string {
  if (!url) return '';

  return `${getImageUrl(url, 400)} 400w, ${getImageUrl(url, 800)} 800w, ${getImageUrl(url, 1200)} 1200w, ${getImageUrl(url, 1600)} 1600w`;
}
