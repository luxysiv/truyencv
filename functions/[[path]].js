const TARGET_DOMAIN = 'https://truyensextv.com';
const FONT_SIZE_CSS = `
  body, body * {
    font-size: 105% !important;
    line-height: 1.6 !important;
  }
`;

const SELECTORS_TO_REMOVE = [
  '#logo',
  'div[class="dulieu"]',
  'div[class="navbar"]',
  'div[class="footer"]'
];

const SCRIPTS_TO_REMOVE_PATTERNS = [
  /truyensex.*\/anh\//,
  /lv\/esnk\//
];

// Bộ xử lý chính
class ContentRewriter {
  constructor() {
    this.element = this.element.bind(this);
  }

  element(element) {
    // Xóa script không mong muốn
    if (element.tagName === 'script' && element.getAttribute('src')) {
      const src = element.getAttribute('src');
      if (SCRIPTS_TO_REMOVE_PATTERNS.some(p => p.test(src))) {
        element.remove();
        return;
      }
    }

    // Xóa đoạn chứa "Bạn đang đọc truyện" hoặc quảng bá tên miền
    if (['p', 'em', 'center', 'div'].includes(element.tagName)) {
      const text = element.textContent?.toLowerCase() || '';
      if (
        text.includes('bạn đang đọc truyện') ||
        text.includes('tại nguồn') ||
        text.includes('truyensextv') ||
        text.includes('truyensextv55') ||
        text.includes('website chuyển qua tên miền')
      ) {
        element.remove();
        return;
      }
    }

    // Xử lý <a>
    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href) {
        try {
          const newUrl = new URL(href, TARGET_DOMAIN);
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {}
      }
    }

    // Xử lý src và data-src
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
      let rewriter = new HTMLRewriter()
        // Thêm base & CSS
        .on('head', {
          element(element) {
            element.append(`<base href="${url.origin}">`, { html: true });
            element.append(`<style>${FONT_SIZE_CSS}</style>`, { html: true });
          }
        });

      // Xóa các phần tử được chỉ định
      SELECTORS_TO_REMOVE.forEach(selector => {
        rewriter = rewriter.on(selector, {
          element(e) {
            e.remove();
          }
        });
      });

      // Xử lý toàn bộ phần tử khác
      rewriter = rewriter.on('*', new ContentRewriter());
      return rewriter.transform(response);
    }

    // Nếu là CSS
    if (contentType.includes('text/css')) {
      const text = await response.text();
      const replaced = text.replace(
        /url\(['"]?(\/[^'")]*)['"]?\)/g,
        `url('${TARGET_DOMAIN}$1')`
      );
      return new Response(replaced, response);
    }

    return response;

  } catch (error) {
    return new Response(`Error fetching from ${targetUrl}: ${error.message}`, {
      status: 500
    });
  }
}
