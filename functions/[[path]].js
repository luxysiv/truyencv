const TARGET_DOMAIN = 'https://truyenxxx.net';

const SCRIPTS_TO_REMOVE_PATTERNS = [
  /anh\//,
  /lv\/esnk\//
];

class ContentRewriter {
  constructor() {
    this.element = this.element.bind(this);
  }

  element(element) {

    // Xóa script theo pattern
    if (element.tagName === 'script' && element.getAttribute('src')) {
      const src = element.getAttribute('src');
      const shouldRemove = SCRIPTS_TO_REMOVE_PATTERNS.some(pattern => pattern.test(src));

      if (shouldRemove) {
        element.remove();
      }
    }

    // Rewrite link <a>
    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href) {
        try {
          const newUrl = new URL(href, TARGET_DOMAIN);
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {}
      }
    }

    // Rewrite src và data-src
    ['src', 'data-src'].forEach(attr => {
      const value = element.getAttribute(attr);

      if (value) {
        try {
          const newUrl = new URL(value, TARGET_DOMAIN);
          element.setAttribute(attr, `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {}
      }
    });

  }
}

export async function onRequest(context) {

  const { request } = context;

  const url = new URL(request.url);
  const path = url.pathname + url.search;

  const targetUrl = `${TARGET_DOMAIN}${path}`;

  try {

    const response = await fetch(targetUrl, {
      headers: request.headers,
      redirect: 'follow'
    });

    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('text/html')) {

      const rewriter = new HTMLRewriter()

        .on('head', {
          element(element) {

            // Chỉ giữ base để fix link
            element.append(
              `<base href="${url.origin}">`,
              { html: true }
            );

          }
        })

        .on('*', new ContentRewriter());

      return rewriter.transform(response);
    }

    // Rewrite CSS url()
    if (contentType.includes('text/css')) {

      const text = await response.text();

      const rewriter = text.replace(
        /url\(['"]?(\/[^'")]*)['"]?\)/g,
        `url('${TARGET_DOMAIN}$1')`
      );

      return new Response(rewriter, response);
    }

    return response;

  } catch (error) {

    return new Response(
      `Error: ${error.message}`,
      { status: 500 }
    );

  }

}
