const TARGET_DOMAIN = 'https://truyensextv.com';

const PREMIUM_UI_CSS = `
  :root {
    --bg-body: #fdfdfd;
    --text-main: #2c3e50;
    --text-content: #34495e;
    --accent: #1abc9c;
    --card-shadow: 0 10px 30px rgba(0,0,0,0.05);
    --font-reading: "Palatino Linotype", "Book Antiqua", Palatino, serif;
  }

  /* Tổng thể trang */
  body {
    background-color: var(--bg-body) !important;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    color: var(--text-main) !important;
    line-height: 1.6 !important;
    margin: 0 auto !important;
    max-width: 650px !important; /* Thu hẹp lại để mắt không phải đảo quá xa */
    padding: 0 15px 80px 15px !important;
  }

  /* Xử lý các khối nội dung thành các thẻ thanh lịch */
  .bai-viet-box, .noidungtruyen, .box, .dulieu, .list2, .noibat {
    background: #ffffff !important;
    border: 1px solid #f0f0f0 !important;
    border-radius: 16px !important;
    box-shadow: var(--card-shadow) !important;
    margin: 20px 0 !important;
    padding: 25px !important;
    overflow: hidden;
  }

  /* Tiêu đề truyện - Font lớn, đậm, màu sang trọng */
  h1, .tenbai, .phdr {
    font-size: 1.6rem !important;
    font-weight: 800 !important;
    color: #222 !important;
    background: none !important;
    border: none !important;
    text-align: center !important;
    display: block !important;
    margin-bottom: 10px !important;
  }

  /* Nội dung chính của truyện - Tối ưu cho việc đọc lâu */
  .noidungtruyen {
    font-family: var(--font-reading) !important;
    font-size: 1.35rem !important;
    line-height: 2 !important; /* Khoảng cách dòng thưa ra để không mỏi mắt */
    color: var(--text-content) !important;
    text-align: justify !important;
    background: #fff !important;
    border: none !important;
    box-shadow: none !important; /* Loại bỏ bóng đổ bên trong nếu bị lồng */
  }

  /* Nút bấm kiểu Apple/Modern */
  .page_nav, .page-numbers, .button, .phantrang a {
    background: #f1f3f5 !important;
    color: #495057 !important;
    border-radius: 12px !important;
    padding: 12px 20px !important;
    margin: 5px !important;
    text-decoration: none !important;
    display: inline-block !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    transition: all 0.2s ease !important;
    border: 1px solid #e9ecef !important;
  }

  .page_nav:hover, .button:hover {
    background: var(--accent) !important;
    color: white !important;
    border-color: var(--accent) !important;
    transform: translateY(-2px);
  }

  /* Thanh điều hướng tinh gọn dưới cùng (Bottom Bar) */
  .custom-nav {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 400px;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(10px);
    border-radius: 25px;
    padding: 10px;
    display: flex;
    justify-content: space-around;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    z-index: 9999;
  }

  /* Ẩn hoàn toàn các thành phần cũ gây xấu trang */
  #logo, .footer, .navbar, .sticky-footer, .logo2, .phdrbox,
  iframe, ins, .adsbygoogle, .sticky-x-button, img[src*="icon"] {
    display: none !important;
  }

  /* Ảnh truyện bo góc đẹp */
  img {
    border-radius: 12px !important;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
  }
`;

class ContentRewriter {
  element(element) {
    if (element.tagName === 'script') {
      element.remove();
      return;
    }

    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href && !href.startsWith('javascript:')) {
        try {
          const newUrl = new URL(href, TARGET_DOMAIN);
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
        } catch (e) {}
      }
    }

    // Xử lý ảnh
    if (element.tagName === 'img') {
      const src = element.getAttribute('src');
      if (src) {
        element.setAttribute('src', new URL(src, TARGET_DOMAIN).href);
      }
    }
  }
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetUrl = `${TARGET_DOMAIN}${url.pathname}${url.search}`;

  const response = await fetch(targetUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1' }
  });

  return new HTMLRewriter()
    .on('head', {
      element(element) {
        element.append(`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">`, { html: true });
        element.append(`<style>${PREMIUM_UI_CSS}</style>`, { html: true });
      }
    })
    .on('body', {
      element(element) {
        // Thêm một thanh điều hướng nhanh giả lập App
        element.append(`
          <div class="custom-nav">
            <a href="/" style="text-decoration:none; color:#333; font-size:20px;">🏠</a>
            <a href="javascript:window.scrollTo({top:0, behavior:'smooth'})" style="text-decoration:none; color:#333; font-size:20px;">⬆️</a>
            <a href="javascript:location.reload()" style="text-decoration:none; color:#333; font-size:20px;">🔄</a>
          </div>
        `, { html: true });
      }
    })
    .on('*', new ContentRewriter())
    .transform(response);
}
