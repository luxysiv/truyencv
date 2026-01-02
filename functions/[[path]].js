const TARGET_DOMAIN = 'https://truyensextv.com';

// CSS cải tiến với focus vào đọc truyện
const ENHANCED_CSS = `
  /* Reset và cơ bản */
  * {
    box-sizing: border-box !important;
    max-width: 100% !important;
  }
  
  body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) fixed !important;
    color: #333 !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
    min-height: 100vh !important;
  }
  
  /* Container chính */
  body > div:not([style]):not(.sticky-footer) {
    background: white !important;
    margin: 0 auto !important;
    padding: 15px !important;
    border-radius: 15px !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important;
    min-height: calc(100vh - 40px) !important;
    max-width: 900px !important;
    position: relative !important;
  }
  
  /* Ẩn các phần không cần thiết */
  .navbar,
  .footer,
  #logo,
  .logo2 > .dulieu:first-child,
  .logo2 > .footer:last-child,
  .logo2 > .ndtruyen:first-child,
  .logo2 > .bai-viet-box:nth-child(20),
  div[style*="text-align"],
  center,
  iframe,
  script[src*="truyensex"],
  script[src*="lv/esnk"],
  .ad,
  .ads,
  .quangcao,
  .sticky-footer,
  .sticky-footer-content,
  .sticky-x-button {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
  }
  
  /* Tiêu đề chương truyện */
  .tenbai {
    font-size: 28px !important;
    font-weight: 700 !important;
    color: #2c3e50 !important;
    text-align: center !important;
    padding: 20px 0 !important;
    margin-bottom: 30px !important;
    border-bottom: 3px solid #667eea !important;
    background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%) !important;
    border-radius: 10px !important;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08) !important;
  }
  
  /* Nội dung truyện - ĐƯỢC PHÓNG TO ĐẶC BIỆT */
  .noidungtruyen {
    font-size: 26px !important;
    line-height: 1.9 !important;
    color: #2c3e50 !important;
    text-align: justify !important;
    padding: 25px !important;
    background: #f8f9fa !important;
    border-radius: 10px !important;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.05) !important;
    font-family: 'Georgia', 'Times New Roman', 'Palatino', serif !important;
    letter-spacing: 0.3px !important;
    word-spacing: 1px !important;
  }
  
  /* Paragraph trong nội dung */
  .noidungtruyen p {
    margin-bottom: 1.8em !important;
    text-indent: 2em !important;
  }
  
  /* Hiệu ứng đọc tốt hơn */
  .noidungtruyen p::first-letter {
    font-size: 1.5em !important;
    font-weight: bold !important;
    color: #667eea !important;
    float: left !important;
    margin-right: 5px !important;
  }
  
  /* Liên kết trong nội dung */
  .noidungtruyen a {
    color: #667eea !important;
    text-decoration: none !important;
    border-bottom: 2px dashed #667eea !important;
    padding-bottom: 2px !important;
    transition: all 0.3s ease !important;
  }
  
  .noidungtruyen a:hover {
    color: #764ba2 !important;
    border-bottom-color: #764ba2 !important;
    background: rgba(102, 126, 234, 0.1) !important;
  }
  
  /* Phân trang */
  .phantrang {
    display: flex !important;
    justify-content: center !important;
    gap: 15px !important;
    margin: 40px 0 20px !important;
    padding: 20px !important;
    background: white !important;
    border-radius: 10px !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
  }
  
  .phantrang a {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white !important;
    padding: 12px 24px !important;
    border-radius: 25px !important;
    text-decoration: none !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    transition: all 0.3s ease !important;
    border: none !important;
    min-width: 120px !important;
    text-align: center !important;
  }
  
  .phantrang a:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08) !important;
  }
  
  /* Thanh cuộn tùy chỉnh */
  ::-webkit-scrollbar {
    width: 10px !important;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1 !important;
    border-radius: 10px !important;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border-radius: 10px !important;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    body > div:not([style]):not(.sticky-footer) {
      padding: 10px !important;
      margin: 10px !important;
      min-height: calc(100vh - 20px) !important;
    }
    
    .tenbai {
      font-size: 24px !important;
      padding: 15px 0 !important;
    }
    
    .noidungtruyen {
      font-size: 22px !important;
      line-height: 1.8 !important;
      padding: 15px !important;
    }
    
    .phantrang {
      flex-direction: column !important;
      align-items: center !important;
      gap: 10px !important;
    }
    
    .phantrang a {
      width: 100% !important;
      max-width: 250px !important;
    }
  }
  
  @media (max-width: 480px) {
    .noidungtruyen {
      font-size: 20px !important;
      line-height: 1.7 !important;
    }
    
    .tenbai {
      font-size: 20px !important;
    }
  }
  
  /* Dark mode hỗ trợ */
  @media (prefers-color-scheme: dark) {
    body {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) fixed !important;
    }
    
    body > div:not([style]):not(.sticky-footer) {
      background: #1e293b !important;
      color: #e2e8f0 !important;
    }
    
    .noidungtruyen {
      background: #334155 !important;
      color: #cbd5e1 !important;
    }
    
    .tenbai {
      background: linear-gradient(120deg, #1e293b 0%, #334155 100%) !important;
      color: #e2e8f0 !important;
    }
  }
`;

const SCRIPTS_TO_REMOVE_PATTERNS = [
  /truyensex.*\/anh\//,
  /lv\/esnk\//,
  /ads/,
  /quangcao/,
  /popup/,
  /banner/
];

class EnhancedContentRewriter {
  constructor() {
    this.element = this.element.bind(this);
  }

  element(element) {
    // Xóa script không mong muốn
    if (element.tagName === 'script') {
      const src = element.getAttribute('src') || '';
      const shouldRemove = SCRIPTS_TO_REMOVE_PATTERNS.some(pattern => 
        pattern.test(src) || pattern.test(element.textContent)
      );
      if (shouldRemove) {
        element.remove();
        return;
      }
    }
    
    // Xóa iframe quảng cáo
    if (element.tagName === 'iframe') {
      element.remove();
      return;
    }
    
    // Xử lý thẻ a
    if (element.tagName === 'a') {
      const href = element.getAttribute('href');
      if (href) {
        try {
          const newUrl = new URL(href, TARGET_DOMAIN);
          element.setAttribute('href', `${newUrl.pathname}${newUrl.search}`);
          
          // Thêm class cho các link phân trang
          if (href.includes('page') || element.textContent.match(/\d+/)) {
            element.className = 'pagination-link';
          }
        } catch (e) {
          console.log('Error processing link:', e);
        }
      }
    }
    
    // Xử lý các thuộc tính src
    ['src', 'data-src', 'href'].forEach(attr => {
      const value = element.getAttribute(attr);
      if (value && value.startsWith('/')) {
        element.setAttribute(attr, `${TARGET_DOMAIN}${value}`);
      }
    });
    
    // Cải thiện tiêu đề
    if (element.hasClass('tenbai')) {
      element.setInnerContent(element.innerHTML.replace(/<br>/g, ' '), { html: true });
    }
  }
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname + url.search;
  const targetUrl = `${TARGET_DOMAIN}${path}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.7,en;q=0.3',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cf: {
        cacheTtl: 300,
        cacheEverything: true
      }
    });

    const contentType = response.headers.get('Content-Type') || '';

    if (contentType.includes('text/html')) {
      const rewriter = new HTMLRewriter()
        .on('head', {
          element(element) {
            // Thêm base URL
            element.append(`<base href="${url.origin}">`, { html: true });
            
            // Thêm CSS enhanced
            element.append(`<style>${ENHANCED_CSS}</style>`, { html: true });
            
            // Thêm viewport mobile-friendly
            element.append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">', { html: true });
            
            // Thêm favicon
            element.append('<link rel="icon" type="image/x-icon" href="https://pages.dev/favicon.ico">', { html: true });
            
            // Thêm title
            element.append(`<title>Truyện Hay - Đọc Truyện Online</title>`, { html: true });
          }
        })
        .on('body', {
          element(element) {
            // Thêm loading indicator
            element.setAttribute('style', 'opacity: 0; transition: opacity 0.3s ease');
            
            // Thêm script để hiển thị sau khi load
            element.append(`
              <script>
                document.addEventListener('DOMContentLoaded', function() {
                  document.body.style.opacity = '1';
                  
                  // Tự động scroll đến nội dung chương
                  const chapterContent = document.querySelector('.noidungtruyen');
                  if (chapterContent) {
                    setTimeout(() => {
                      chapterContent.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                  
                  // Lưu scroll position
                  window.addEventListener('scroll', function() {
                    sessionStorage.setItem('scrollPos', window.scrollY);
                  });
                  
                  // Khôi phục scroll position
                  const savedScroll = sessionStorage.getItem('scrollPos');
                  if (savedScroll) {
                    window.scrollTo(0, parseInt(savedScroll));
                  }
                });
                
                // Click ra ngoài để tắt highlight
                document.addEventListener('click', function(e) {
                  if (!e.target.matches('.noidungtruyen *')) {
                    document.querySelectorAll('.noidungtruyen *').forEach(el => {
                      el.style.backgroundColor = '';
                    });
                  }
                });
              </script>
            `, { html: true });
          }
        })
        .on('*', new EnhancedContentRewriter());

      const modifiedResponse = rewriter.transform(response);
      const headers = new Headers(modifiedResponse.headers);
      headers.set('Content-Type', 'text/html; charset=utf-8');
      headers.set('Cache-Control', 'public, max-age=3600');
      
      return new Response(modifiedResponse.body, {
        status: modifiedResponse.status,
        statusText: modifiedResponse.statusText,
        headers: headers
      });
    }

    if (contentType.includes('text/css')) {
      const text = await response.text();
      // Fix CSS background URLs
      const fixedCSS = text.replace(
        /url\(['"]?(\/[^'")]*)['"]?\)/g,
        `url('${TARGET_DOMAIN}$1')`
      );
      return new Response(fixedCSS, {
        headers: {
          'Content-Type': 'text/css; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    return response;

  } catch (error) {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lỗi - Truyện Hay</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              text-align: center;
              padding: 20px;
            }
            .error-container {
              background: white;
              color: #333;
              padding: 40px;
              border-radius: 20px;
              max-width: 500px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            h1 {
              color: #e74c3c;
              margin-bottom: 20px;
            }
            .retry-btn {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 12px 30px;
              border-radius: 25px;
              font-size: 16px;
              cursor: pointer;
              margin-top: 20px;
              transition: transform 0.3s ease;
            }
            .retry-btn:hover {
              transform: translateY(-2px);
            }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>⚠️ Đã xảy ra lỗi</h1>
            <p>Không thể tải trang. Vui lòng thử lại sau.</p>
            <p><small>${error.message}</small></p>
            <button class="retry-btn" onclick="window.location.reload()">Thử lại</button>
          </div>
        </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}
