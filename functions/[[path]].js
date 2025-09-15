const TARGET_DOMAIN = 'https://truyensextv.com';
const FONT_SIZE_CSS = `
  body, body * {
    font-size: 105% !important;
    line-height: 1.6 !important;
  }

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

// Lớp xử lý chính cho việc thay đổi các thẻ a và loại bỏ script
class ContentRewriter {
  constructor() {
    this.element = this.element.bind(this);
  }

  element(element) {
    // Xóa các script không mong muốn
    if (element.tagName === 'script' && element.getAttribute('src')) {
      const src = element.getAttribute('src');
      const shouldRemove = SCRIPTS_TO_REMOVE_PATTERNS.some(pattern => pattern.test(src));
      if (shouldRemove) {
        element.remove();
      }
    }

    // Chỉnh sửa tất cả các liên kết (thẻ <a>)
    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href) {
        try {
          // Chuyển đổi mọi URL (tuyệt đối hay tương đối) thành đường dẫn tương đối
          const newUrl = new URL(href, TARGET_DOMAIN);
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {
          // Bỏ qua các đường dẫn không hợp lệ
        }
      }
    }

    // Chỉnh sửa các đường dẫn trong các thuộc tính khác
    ['src', 'data-src'].forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        try {
          const newUrl = new URL(value, TARGET_DOMAIN);
          element.setAttribute(attr, `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {
          // Bỏ qua các đường dẫn không hợp lệ
        }
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
        // Bộ xử lý riêng để chèn <style> và <base> vào thẻ <head>
        .on('head', {
          element(element) {
            element.append(`<base href="${url.origin}">`, { html: true });
            element.append(`<style>${FONT_SIZE_CSS}</style>`, { html: true });
          }
        })
        // Bộ xử lý chung để thay đổi nội dung trang
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
    return new Response(`Error fetching from ${targetUrl}: ${error.message}`, {
      status: 500
    });
  }
}
