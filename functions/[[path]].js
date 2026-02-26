const TARGET_DOMAIN = 'https://truyensextv.com';

// Cải tiến CSS với Media Query để xử lý màn hình lớn
const FONT_SIZE_CSS = `
  /* Mặc định cho điện thoại (giữ nguyên 105% như bạn muốn) */
  body, body * {
    font-size: 105% !important;
    line-height: 1.6 !important;
  }

  /* Dành cho màn hình Laptop/Desktop (thường từ 1024px trở lên) */
  @media (min-width: 1024px) {
    body, body * {
      font-size: 125% !important; /* Tăng rõ rệt để không bị bé trên màn hình lớn */
      line-height: 1.7 !important;
    }
  }

  /* Dành cho màn hình cực lớn hoặc 4K (từ 1920px trở lên) */
  @media (min-width: 1920px) {
    body, body * {
      font-size: 140% !important;
    }
  }
  
  /* Các selector ẩn thành phần thừa của bạn */
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
  /truyensex.*\/anh\//,
  /lv\/esnk\//
];

class ContentRewriter {
  constructor() {
    this.element = this.element.bind(this);
  }

  element(element) {
    if (element.tagName === 'script' && element.getAttribute('src')) {
      const src = element.getAttribute('src');
      const shouldRemove = SCRIPTS_TO_REMOVE_PATTERNS.some(pattern => pattern.test(src));
      if (shouldRemove) {
        element.remove();
      }
    }

    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href) {
        try {
          const newUrl = new URL(href, TARGET_DOMAIN);
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {}
      }
    }

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
            // Thêm base để fix link tương đối
            element.append(`<base href="${url.origin}">`, { html: true });
            // Chèn CSS Media Query vào
            element.append(`<style>${FONT_SIZE_CSS}</style>`, { html: true });
          }
        })
        .on('*', new ContentRewriter());

      return rewriter.transform(response);
    }

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
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
