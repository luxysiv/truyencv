const TARGET_DOMAIN = 'https://truyensextv.com';

// CSS giao diện hiện đại: Card UI, Font sạch, No-Ads
const MODERN_UI_CSS = `
  :root {
    --primary-color: #27ae60;
    --bg-color: #f0f2f5;
    --card-bg: #ffffff;
    --text-main: #1c1e21;
    --text-muted: #606770;
  }

  body {
    background-color: var(--bg-color) !important;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    color: var(--text-main) !important;
    line-height: 1.75 !important;
    margin: 0 auto !important;
    max-width: 700px !important; /* Độ rộng tối ưu để đọc */
    padding-bottom: 50px;
  }

  /* Biến các khối nội dung thành Card */
  .bai-viet-box, .noidungtruyen, .box, .dulieu, .list2, .noibat {
    background: var(--card-bg) !important;
    border: none !important;
    border-radius: 12px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
    margin: 12px 8px !important;
    padding: 16px !important;
  }

  /* Tiêu đề */
  h1, .tenbai, .phdr {
    color: var(--primary-color) !important;
    font-size: 1.3rem !important;
    font-weight: 800 !important;
    background: none !important;
    border: none !important;
    padding: 10px 0 !important;
  }

  /* Nội dung truyện - Quan trọng nhất */
  .noidungtruyen {
    font-size: 1.2rem !important;
    text-align: justify !important;
    color: #222 !important;
    white-space: pre-line !important; /* Giữ xuống dòng tự nhiên */
    line-height: 1.9 !important;
  }

  /* Phân trang kiểu nút bấm hiện đại */
  .page_nav, .page-numbers, .button, .phantrang a {
    background: var(--primary-color) !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 16px !important;
    margin: 4px !important;
    text-decoration: none !important;
    display: inline-block !important;
    font-weight: 600 !important;
    font-size: 13px !important;
  }

  /* Ẩn các thành phần thừa và quảng cáo */
  #logo, .footer, .navbar, .sticky-footer, 
  iframe, ins, .adsbygoogle, .logo2 > div:first-child,
  .sticky-x-button {
    display: none !important;
  }

  /* Responsive di động */
  @media (max-width: 600px) {
    .noidungtruyen { font-size: 1.15rem !important; }
    body { background-color: #fff !important; }
  }
`;

const SCRIPTS_TO_REMOVE = [
  /truyensex.*\/anh\//,
  /lv\/esnk\//,
  /google-analytics/,
  /doubleclick/,
  /histats/
];

class ContentRewriter {
  element(element) {
    // 1. Loại bỏ script rác
    if (element.tagName === 'script') {
      const src = element.getAttribute('src');
      if (src && SCRIPTS_TO_REMOVE.some(p => p.test(src))) {
        element.remove();
        return;
      }
    }

    // 2. Proxy các liên kết <a>
    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
        try {
          const newUrl = new URL(href, TARGET_DOMAIN);
          // Giữ link chạy trên domain Pages.dev hiện tại
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {}
      }
    }

    // 3. Sửa link Ảnh (Phải lấy từ domain gốc để hiển thị)
    ['src', 'data-src', 'href'].forEach(attr => {
      if (element.tagName === 'img' || (element.tagName === 'a' && attr === 'href')) {
        const val = element.getAttribute(attr);
        if (val && (val.includes('.jpg') || val.includes('.png') || val.includes('.webp'))) {
          try {
            const absUrl = new URL(val, TARGET_DOMAIN).href;
            element.setAttribute(attr, absUrl);
          } catch (e) {}
        }
      }
    });
  }
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Tạo URL đích tới trang gốc
  const targetUrl = `${TARGET_DOMAIN}${url.pathname}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0',
        'Accept-Language': request.headers.get('Accept-Language') || 'vi-VN,vi;q=0.9'
      },
      redirect: 'follow'
    });

    const contentType = response.headers.get('Content-Type') || '';

    // Xử lý trang HTML
    if (contentType.includes('text/html')) {
      return new HTMLRewriter()
        .on('head', {
          element(element) {
            // Thêm Meta Mobile & CSS mới
            element.append(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`, { html: true });
            element.append(`<style>${MODERN_UI_CSS}</style>`, { html: true });
          }
        })
        .on('*', new ContentRewriter())
        .transform(response);
    }

    // Xử lý file CSS gốc (Fix link font/ảnh bên trong CSS)
    if (contentType.includes('text/css')) {
      let cssText = await response.text();
      cssText = cssText.replace(/url\(['"]?(\/[^'")]*)['"]?\)/g, `url('${TARGET_DOMAIN}$1')`);
      return new Response(cssText, { headers: { 'Content-Type': 'text/css' } });
    }

    // Trả về trực tiếp cho các tài nguyên khác (ảnh, font...)
    return response;

  } catch (error) {
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}
