export async function onRequest(context) {
  const TARGET_DOMAIN = 'https://truyensextv.com';
  const { request } = context;

  const url = new URL(request.url);
  const targetUrl = TARGET_DOMAIN + url.pathname + url.search;

  const FONT_SIZE_CSS = `
    /* ===== MOBILE mặc định ===== */
    html {
      font-size: 105% !important;
    }

    body {
      line-height: 1.6 !important;
    }

    /* ===== DESKTOP ===== */
    @media (min-width: 1200px) {
      html {
        font-size: 115% !important;
      }
      body {
        line-height: 1.75 !important;
      }
    }

    /* ===== MÀN HÌNH LỚN (2K+) ===== */
    @media (min-width: 1440px) {
      html {
        font-size: 125% !important;
      }
      body {
        line-height: 1.85 !important;
      }
    }

    /* ===== ẨN THÀNH PHẦN KHÔNG CẦN ===== */
    div.logo2,
    div.navbar,
    div.footer,
    #logo {
      display: none !important;
    }
  `;

  const SCRIPTS_TO_REMOVE_PATTERNS = [
    /truyensex.*\/anh\//,
    /lv\/esnk\//
  ];

  class ContentRewriter {
    element(element) {
      // Xóa script không mong muốn
      if (element.tagName === 'script') {
        const src = element.getAttribute('src');
        if (src && SCRIPTS_TO_REMOVE_PATTERNS.some(p => p.test(src))) {
          element.remove();
        }
      }

      // Rewrite link <a>
      if (element.tagName === 'a') {
        const href = element.getAttribute('href');
        if (href) {
          try {
            const newUrl = new URL(href, TARGET_DOMAIN);
            element.setAttribute('href', newUrl.pathname + newUrl.search);
          } catch {}
        }
      }

      // Rewrite src / data-src
      ['src', 'data-src'].forEach(attr => {
        const value = element.getAttribute(attr);
        if (value) {
          try {
            const newUrl = new URL(value, TARGET_DOMAIN);
            element.setAttribute(attr, newUrl.pathname + newUrl.search);
          } catch {}
        }
      });
    }
  }

  try {
    const response = await fetch(targetUrl, {
      headers: request.headers,
      redirect: 'follow'
    });

    const contentType = response.headers.get('content-type') || '';

    // ===== HTML =====
    if (contentType.includes('text/html')) {
      return new HTMLRewriter()
        .on('head', {
          element(element) {
            element.append(`<base href="${url.origin}">`, { html: true });
            element.append(`<style>${FONT_SIZE_CSS}</style>`, { html: true });
          }
        })
        .on('*', new ContentRewriter())
        .transform(response);
    }

    // ===== CSS =====
    if (contentType.includes('text/css')) {
      const text = await response.text();
      const rewritten = text.replace(
        /url\(['"]?(\/[^'")]*)['"]?\)/g,
        `url('${TARGET_DOMAIN}$1')`
      );
      return new Response(rewritten, response);
    }

    return response;

  } catch (err) {
    return new Response("Fetch error: " + err.message, { status: 500 });
  }
}
