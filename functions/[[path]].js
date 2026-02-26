const TARGET_DOMAIN = 'https://truyensextv.com';

// CSS tối ưu: Tự động giãn font từ 1.1rem (máy tính bảng) lên 1.5rem (màn hình 4K)
const FONT_SIZE_CSS = `
  :root {
    --base-font-size: clamp(1.15rem, 1rem + 0.6vw, 1.6rem);
  }

  html, body {
    font-size: var(--base-font-size) !important;
    line-height: 1.8 !important;
    font-family: -apple-system, system-ui, sans-serif !important;
    background-color: #f4f4f4; /* Màu nền nhẹ cho đỡ mỏi mắt */
  }

  /* Ép mọi phần tử con kế thừa font size từ root */
  body * {
    font-size: inherit !important;
    line-height: inherit !important;
  }

  /* Ẩn các thành phần rác và quảng cáo */
  div.logo2:nth-child(3) > div.dulieu:first-child > div.box,
  #logo,
  div.navbar,
  div.footer,
  .dulieu,
  .bai-viet-box,
  ins, .adsbygoogle,
  div[style*="fixed"] { 
    display: none !important; 
  }

  /* Căn giữa nội dung chính để dễ đọc trên màn hình cực rộng */
  body {
    max-width: 1200px;
    margin: 0 auto !important;
    background: white;
    padding: 10px;
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
    // 1. Loại bỏ các script không cần thiết
    if (element.tagName === 'script') {
      const src = element.getAttribute('src');
      if (src && SCRIPTS_TO_REMOVE_PATTERNS.some(p => p.test(src))) {
        element.remove();
        return;
      }
    }

    // 2. Sửa link thẻ <a>
    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        try {
          const newUrl = new URL(href, TARGET_DOMAIN);
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {}
      }
    }

    // 3. Sửa link ảnh và các tài nguyên khác
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

// Cấu trúc chuẩn cho Cloudflare Pages Functions
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

    // Xử lý HTML
    if (contentType.includes('text/html')) {
      return new HTMLRewriter()
        .on('head', {
          element(element) {
            // Thêm meta viewport để ép trình duyệt nhận diện tỷ lệ màn hình lớn
            element.append('<meta name="viewport" content="width=device-width, initial-scale=1.0">', { html: true });
            element.append(`<base href="${url.origin}/">`, { html: true });
            element.append(`<style>${FONT_SIZE_CSS}</style>`, { html: true });
          }
        })
        .on('*', new ContentRewriter())
        .transform(response);
    }

    // Xử lý CSS bên ngoài (nếu có)
    if (contentType.includes('text/css')) {
      let text = await response.text();
      text = text.replace(/url\(['"]?(\/[^'")]*)['"]?\)/g, `url('${TARGET_DOMAIN}$1')`);
      return new Response(text, { 
        headers: { ...Object.fromEntries(response.headers), 'Content-Type': 'text/css' } 
      });
    }

    return response;

  } catch (error) {
    return new Response(`Lỗi Proxy: ${error.message}`, { status: 500 });
  }
}
