const TARGET_DOMAIN = 'https://truyenxxx.net';

const FONT_SIZE_CSS = `
.single-content {
  font-size: 115% !important;
  line-height: 1.7 !important;
}

@media (min-width: 1024px) {
  .single-content {
    font-size: 130% !important;
  }
}

@media (min-width: 1920px) {
  .single-content {
    font-size: 145% !important;
  }
}
`;

const SCRIPTS_TO_REMOVE_PATTERNS = [
  /anh\//,
  /lv\/esnk\//
];

class ContentRewriter {

  element(element) {

    // Xóa script quảng cáo
    if (element.tagName === 'script' && element.getAttribute('src')) {

      const src = element.getAttribute('src');

      const remove = SCRIPTS_TO_REMOVE_PATTERNS.some(p => p.test(src));

      if (remove) element.remove();

    }

    // Xóa <p></p> rỗng
    if (element.tagName === 'p') {

      const html = element.innerHTML;

      if (!html || html.trim() === '') {
        element.remove();
      }

    }

    // Xóa <br> liên tiếp
    if (element.tagName === 'br') {

      const next = element.nextSibling;

      if (next && next.tagName === 'br') {
        element.remove();
      }

    }

    // Rewrite link
    if (element.tagName === 'a') {

      const href = element.getAttribute('href');

      if (href) {
        try {

          const newUrl = new URL(href, TARGET_DOMAIN);

          element.setAttribute(
            'href',
            newUrl.pathname + newUrl.search
          );

        } catch(e){}
      }

    }

    // Rewrite src
    ['src','data-src'].forEach(attr => {

      const value = element.getAttribute(attr);

      if (value) {

        try {

          const newUrl = new URL(value, TARGET_DOMAIN);

          element.setAttribute(
            attr,
            newUrl.pathname + newUrl.search
          );

        } catch(e){}

      }

    });

  }

}

export async function onRequest(context) {

  const { request } = context;

  const url = new URL(request.url);

  const targetUrl = TARGET_DOMAIN + url.pathname + url.search;

  try {

    const response = await fetch(targetUrl, {
      headers: request.headers,
      redirect: 'follow'
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {

      const rewriter = new HTMLRewriter()

      .on('head', {
        element(el) {

          el.append(`<base href="${url.origin}">`, { html:true });

          el.append(`<style>${FONT_SIZE_CSS}</style>`, { html:true });

        }
      })

      .on('*', new ContentRewriter());

      return rewriter.transform(response);

    }

    if (contentType.includes('text/css')) {

      const text = await response.text();

      const rewritten = text.replace(
        /url\(['"]?(\/[^'")]*)['"]?\)/g,
        `url('${TARGET_DOMAIN}$1')`
      );

      return new Response(rewritten, response);

    }

    return response;

  } catch (e) {

    return new Response(
      "Error: " + e.message,
      { status:500 }
    );

  }

}
