const TARGET_DOMAIN = 'https://truyensextv.com';

// Sử dụng clamp để font chữ tự động giãn từ 1.1rem đến 1.5rem tùy màn hình
const FONT_SIZE_CSS = `
  :root {
    --base-font-size: clamp(1.1rem, 1rem + 0.5vw, 1.5rem);
  }

  html, body {
    font-size: var(--base-font-size) !important;
    line-height: 1.8 !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
  }

  /* Ép tất cả các thẻ con kế thừa font size từ root */
  body * {
    font-size: inherit !important;
    line-height: inherit !important;
  }

  /* Danh sách các phần tử cần ẩn (tối ưu selector) */
  div.logo2:nth-child(3) > div.dulieu:first-child > div.box,
  #logo,
  div.navbar,
  div.footer,
  .dulieu,
  .bai-viet-box,
  ins, .adsbygoogle { 
    display: none !important; 
  }
`;

const SCRIPTS_TO_REMOVE_PATTERNS = [
  /truyensex.*\/anh\//,
  /lv\/esnk\//,
  /google-analytics/,
  /adsbygoogle/
];

class ContentRewriter {
  element(element) {
    // 1. Xóa các script quảng cáo/theo dõi
    if (element.tagName === 'script') {
      const src = element.getAttribute('src');
      if (src && SCRIPTS_TO_REMOVE_PATTERNS.some(pattern => pattern.test(src))) {
        element.remove();
        return;
      }
    }

    // 2. Chuyển đổi href của thẻ <a> về relative path
    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        try {
          const newUrl = new URL(href, TARGET_DOMAIN);
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {}
      }
    }

    // 3. Sửa lỗi đường dẫn ảnh (src, data-src)
    ['src', 'data-src', 'srcset'].forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        try {
          const newUrl = new URL(value, TARGET_DOMAIN);
          element.setAttribute(attr, newUrl.toString());
        } catch (e) {}
      }
    });
  }
}

export default {
  async fetch(request, env, ctx) {
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
        return new HTMLRewriter()
          .on('head', {
            element(element) {
              // Thêm meta viewport để mobile/màn hình lớn nhận diện đúng tỉ lệ
              element.append('<meta name="viewport" content="width=device-width, initial-scale=1.0">', { html: true });
              element.append(`<base href="${url.origin}/">`, { html: true });
              element.append(`<style>${FONT_SIZE_CSS}</style>`, { html: true });
            }
          })
          .on('*', new ContentRewriter())
          .transform(response);
      }

      // Xử lý CSS bên ngoài để fix link ảnh/font
      if (contentType.includes('text/css')) {
        let text = await response.text();
        text = text.replace(/url\(['"]?(\/[^'")]*)['"]?\)/g, `url('${TARGET_DOMAIN}$1')`);
        return new Response(text, { headers: response.headers });
      }

      return response;

    } catch (error) {
      return new Response(`Lỗi kết nối: ${error.message}`, { status: 500 });
    }
  }
};
