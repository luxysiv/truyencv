const TARGET_DOMAIN = 'https://truyenxxx.net';

// CSS chỉ phóng to nội dung truyện
const FONT_SIZE_CSS = `
.single-content p {
  font-size: 120% !important;
  line-height: 1.7 !important;
}

@media (min-width: 1024px) {
  .single-content p {
    font-size: 130% !important;
  }
}

@media (min-width: 1920px) {
  .single-content p {
    font-size: 145% !important;
  }
}

/* Ẩn các phần không cần thiết */
div.logo2:nth-child(3) > div.dulieu:first-child > div.box > span:last-child,
div.logo2:nth-child(3) > div.dulieu:first-child > div.box,
#logo,
div.logo2:nth-child(3) > div.footer:last-child > center,
div.navbar:nth-child(2),
div.logo2:nth-child(3) > div.dulieu:first-child,
div.logo2:nth-child(3) > div.footer:last-child,
div.logo2:nth-child(3) > div.ndtruyen:nth-child(7) > em:first-child,
div.logo2:nth-child(3) > div.bai-viet-box:nth-child(20),
div[class="dulieu"],
div[class="navbar"],
div[class="footer"] {
  display: none !important;
}
`;

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

      const shouldRemove = SCRIPTS_TO_REMOVE_PATTERNS.some(pattern =>
        pattern.test(src)
      );

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

          element.setAttribute(
            'href',
            `${newUrl.pathname}${newUrl.search}`
          );

        } catch (e) {}
      }
    }

    // Rewrite src và data-src
    ['src', 'data-src'].forEach(attr => {

      const value = element.getAttribute(attr);

      if (value) {
        try {

          const newUrl = new URL(value, TARGET_DOMAIN);

          element.setAttribute(
            attr,
            `${newUrl.pathname}${newUrl.search}`
          );

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

    // HTML
    if (contentType.includes('text/html')) {

      const rewriter = new HTMLRewriter()

        .on('head', {
          element(element) {

            // Fix link tương đối
            element.append(
              `<base href="${url.origin}">`,
              { html: true }
            );

            // Chèn CSS
            element.append(
              `<style>${FONT_SIZE_CSS}</style>`,
              { html: true }
            );

          }
        })

        .on('*', new ContentRewriter());

      return rewriter.transform(response);
    }

    // CSS
    if (contentType.includes('text/css')) {

      const text = await response.text();

      const rewritten = text.replace(
        /url\(['"]?(\/[^'")]*)['"]?\)/g,
        `url('${TARGET_DOMAIN}$1')`
      );

      return new Response(rewritten, response);
    }

    return response;

  } catch (error) {

    return new Response(
      `Error: ${error.message}`,
      { status: 500 }
    );

  }

}
