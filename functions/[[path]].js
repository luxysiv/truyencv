const TARGET_DOMAIN = 'https://truyensextv.com';

// Giao diện mới: Hiện đại, tập trung vào trải nghiệm đọc
const MODERN_UI_CSS = `
  :root {
    --primary-color: #2ecc71;
    --bg-color: #f8f9fa;
    --text-color: #2c3e50;
    --box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  }

  body {
    background-color: var(--bg-color) !important;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
    color: var(--text-color) !important;
    line-height: 1.8 !important;
    margin: 0 auto !important;
    max-width: 800px !important;
  }

  /* Làm mới các khối nội dung */
  .bai-viet-box, .noidungtruyen, .box, .dulieu, .list2 {
    background: #ffffff !important;
    border: none !important;
    border-radius: 12px !important;
    box-shadow: var(--box-shadow) !important;
    margin: 15px 10px !important;
    padding: 20px !important;
  }

  /* Tiêu đề truyện */
  h1, .tenbai, .phdr {
    color: var(--primary-color) !important;
    font-size: 1.4rem !important;
    font-weight: 700 !important;
    background: none !important;
    border: none !important;
    text-transform: none !important;
  }

  /* Nội dung truyện chính */
  .noidungtruyen {
    font-size: 1.25rem !important;
    text-align: justify !important;
    color: #1a1a1a !important;
    white-space: pre-line !important;
  }

  /* Nút bấm và Phân trang */
  .page_nav, .page-numbers, .button, .phantrang a {
    background: var(--primary-color) !important;
    color: white !important;
    border: none !important;
    border-radius: 30px !important;
    padding: 8px 20px !important;
    margin: 5px !important;
    text-decoration: none !important;
    display: inline-block !important;
    font-size: 14px !important;
    transition: all 0.3s ease !important;
  }

  .page_nav:hover, .button:hover {
    filter: brightness(1.1) !important;
    transform: translateY(-2px) !important;
  }

  /* Ẩn rác và quảng cáo */
  #logo, .footer, .navbar, .sticky-footer, .logo2 > div:first-child,
  iframe, ins, .adsbygoogle, [id*="google_ads"] {
    display: none !important;
  }

  /* Tối ưu hóa cho thiết bị di động */
  @media (max-width: 600px) {
    .noidungtruyen { font-size: 1.1rem !important; padding: 15px !important; }
    body { font-size: 16px !important; }
  }
`;

const SCRIPTS_TO_REMOVE_PATTERNS = [
  /truyensex.*\/anh\//,
  /lv\/esnk\//,
  /google-analytics/,
  /doubleclick/
];

class ContentRewriter {
  constructor(origin) {
    this.origin = origin;
  }

  element(element) {
    // 1. Xóa script rác
    if (element.tagName === 'script') {
      const src = element.getAttribute('src');
      if (src && SCRIPTS_TO_REMOVE_PATTERNS.some(pattern => pattern.test(src))) {
        element.remove();
        return;
      }
    }

    // 2. Sửa liên kết thẻ <a>
    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href && !href.startsWith('javascript:')) {
        try {
          const newUrl = new URL(href, TARGET_DOMAIN);
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {}
      }
    }

    // 3. Sửa đường dẫn ảnh/dữ liệu
    ['src', 'data-src'].forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        try {
          // Nếu là đường dẫn tương đối, chuyển về domain gốc để hiển thị được ảnh
          const absoluteUrl = new URL(value, TARGET_DOMAIN).href;
          element.setAttribute(attr, absoluteUrl);
        } catch (e) {}
      }
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = `${TARGET_DOMAIN}${url.pathname}${url.search}`;

    try {
      const response = await fetch(targetUrl, {
        headers: request.headers,
        redirect: 'follow'
      });

      const contentType = response.headers.get('Content-Type') || '';

      // Xử lý HTML
      if (contentType.includes('text/html')) {
        return new HTMLRewriter()
          .on('head', {
            element(element) {
              element.append(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`, { html: true });
              element.append(`<style>${MODERN_UI_CSS}</style>`, { html: true });
            }
          })
          .on('*', new ContentRewriter(url.origin))
          .transform(response);
      }

      // Xử lý CSS (Sửa các đường dẫn url() bên trong CSS)
      if (contentType.includes('text/css')) {
        let text = await response.text();
        text = text.replace(/url\(['"]?(\/[^'")]*)['"]?\)/g, `url('${TARGET_DOMAIN}$1')`);
        return new Response(text, {
          headers: { 'Content-Type': 'text/css' }
        });
      }

      return response;
    } catch (error) {
      return new Response(`Lỗi kết nối: ${error.message}`, { status: 500 });
    }
  }
};
