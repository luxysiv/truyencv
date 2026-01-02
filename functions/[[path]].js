const TARGET_DOMAIN = 'https://truyensextv.com';

// CSS HOÀN TOÀN MỚI - KHÔNG PHỤ THUỘC VÀO CSS GỐC
const COMPLETE_CSS = `
  /* ===== RESET & BASE ===== */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    color: #2d3748;
    min-height: 100vh;
    padding: 20px;
    line-height: 1.6;
  }
  
  /* ===== CONTAINER CHÍNH ===== */
  .reader-container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
  }
  
  /* ===== HEADER ===== */
  .reader-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 30px;
    text-align: center;
  }
  
  .reader-header h1 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .chapter-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
  }
  
  .nav-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .nav-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  .chapter-info {
    font-size: 14px;
    opacity: 0.9;
  }
  
  /* ===== NỘI DUNG TRUYỆN - CHỮ SIÊU TO ===== */
  .story-content {
    padding: 40px 30px;
    background: #f8f9fa;
    min-height: 60vh;
  }
  
  .story-text {
    font-size: 28px !important;
    line-height: 2.0 !important;
    color: #1a202c;
    text-align: justify;
    font-family: 'Georgia', 'Times New Roman', 'Palatino', serif;
    letter-spacing: 0.5px;
    word-spacing: 1.5px;
  }
  
  /* Từng đoạn văn */
  .story-text p {
    margin-bottom: 2.5em !important;
    text-indent: 3em !important;
    position: relative;
  }
  
  /* Chữ cái đầu to đặc biệt */
  .story-text p:first-of-type::first-letter {
    font-size: 4.5em !important;
    font-weight: bold;
    color: #667eea;
    float: left;
    line-height: 0.8;
    margin-right: 15px;
    margin-top: 5px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
  
  /* Highlight khi chọn */
  .story-text ::selection {
    background: rgba(102, 126, 234, 0.3);
  }
  
  /* ===== CONTROL PANEL ===== */
  .control-panel {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    padding: 15px;
    z-index: 1000;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .control-btn {
    background: #667eea;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .control-btn:hover {
    background: #764ba2;
    transform: scale(1.1);
  }
  
  .font-size-display {
    font-size: 14px;
    color: #667eea;
    font-weight: 600;
    min-width: 60px;
    text-align: center;
  }
  
  /* ===== FOOTER ===== */
  .reader-footer {
    background: #f8f9fa;
    padding: 20px 30px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .page-numbers {
    display: flex;
    gap: 10px;
  }
  
  .page-btn {
    background: white;
    border: 2px solid #667eea;
    color: #667eea;
    padding: 8px 15px;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .page-btn:hover {
    background: #667eea;
    color: white;
  }
  
  .page-btn.current {
    background: #667eea;
    color: white;
  }
  
  /* ===== CUSTOM SCROLLBAR ===== */
  ::-webkit-scrollbar {
    width: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
  
  /* ===== DARK MODE ===== */
  @media (prefers-color-scheme: dark) {
    body {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
    }
    
    .reader-container {
      background: #1e293b;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .story-content {
      background: #0f172a;
    }
    
    .story-text {
      color: #cbd5e1;
    }
    
    .control-panel {
      background: #334155;
    }
    
    .reader-footer {
      background: #0f172a;
      border-top-color: #334155;
    }
    
    .page-btn {
      background: #334155;
      border-color: #667eea;
      color: #cbd5e1;
    }
    
    .page-btn:hover {
      background: #667eea;
      color: white;
    }
  }
  
  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    body {
      padding: 10px;
    }
    
    .reader-header {
      padding: 15px 20px;
    }
    
    .reader-header h1 {
      font-size: 20px;
    }
    
    .story-content {
      padding: 25px 20px;
    }
    
    /* CHỮ VẪN RẤT TO TRÊN MOBILE */
    .story-text {
      font-size: 24px !important;
      line-height: 1.9 !important;
    }
    
    .chapter-nav {
      flex-direction: column;
      gap: 15px;
    }
    
    .control-panel {
      bottom: 20px;
      right: 20px;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 200px;
    }
    
    .reader-footer {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
  }
  
  @media (max-width: 480px) {
    .story-text {
      font-size: 22px !important;
      line-height: 1.8 !important;
    }
    
    .story-text p {
      margin-bottom: 2em !important;
      text-indent: 2.5em !important;
    }
    
    .story-text p:first-of-type::first-letter {
      font-size: 3.5em !important;
    }
  }
  
  /* ===== LOADING ANIMATION ===== */
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// HTML template hoàn toàn mới
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>Đọc Truyện - Reader Mode</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>${COMPLETE_CSS}</style>
    <base href="${TARGET_DOMAIN}">
</head>
<body>
    <div class="loading" id="loading">
        <div class="spinner"></div>
    </div>
    
    <div class="reader-container" id="readerContainer" style="display: none;">
        <!-- Header với điều hướng -->
        <div class="reader-header">
            <h1 id="chapterTitle">Đang tải...</h1>
            <div class="chapter-info">
                <span id="chapterInfo">Chương 1</span>
            </div>
            <div class="chapter-nav">
                <a href="#" class="nav-btn" id="prevBtn">
                    <i class="fas fa-chevron-left"></i> Chương trước
                </a>
                <a href="/" class="nav-btn">
                    <i class="fas fa-home"></i> Trang chủ
                </a>
                <a href="#" class="nav-btn" id="nextBtn">
                    Chương sau <i class="fas fa-chevron-right"></i>
                </a>
            </div>
        </div>
        
        <!-- Nội dung truyện -->
        <div class="story-content">
            <div class="story-text" id="storyContent">
                Đang tải nội dung...
            </div>
        </div>
        
        <!-- Footer với phân trang -->
        <div class="reader-footer">
            <div class="page-links" id="pageLinks"></div>
            <div class="page-numbers">
                <a href="/" class="page-btn"><i class="fas fa-list"></i> Danh sách</a>
                <a href="#" class="page-btn" id="topBtn"><i class="fas fa-arrow-up"></i> Lên đầu</a>
            </div>
        </div>
    </div>
    
    <!-- Control Panel -->
    <div class="control-panel" id="controlPanel">
        <button class="control-btn" id="fontSizeDown" title="Giảm cỡ chữ">
            <i class="fas fa-font"></i>-
        </button>
        <div class="font-size-display" id="fontSizeDisplay">100%</div>
        <button class="control-btn" id="fontSizeUp" title="Tăng cỡ chữ">
            <i class="fas fa-font"></i>+
        </button>
        <button class="control-btn" id="nightMode" title="Chế độ tối">
            <i class="fas fa-moon"></i>
        </button>
        <button class="control-btn" id="copyChapter" title="Sao chép">
            <i class="far fa-copy"></i>
        </button>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Hiển thị container, ẩn loading
            document.getElementById('loading').style.display = 'none';
            document.getElementById('readerContainer').style.display = 'block';
            
            // Font size control
            let currentFontSize = 100;
            const storyText = document.getElementById('storyContent');
            const fontSizeDisplay = document.getElementById('fontSizeDisplay');
            
            document.getElementById('fontSizeUp').addEventListener('click', () => {
                currentFontSize += 10;
                if (currentFontSize > 200) currentFontSize = 200;
                updateFontSize();
            });
            
            document.getElementById('fontSizeDown').addEventListener('click', () => {
                currentFontSize -= 10;
                if (currentFontSize < 70) currentFontSize = 70;
                updateFontSize();
            });
            
            function updateFontSize() {
                const baseSize = 28; // Kích thước base từ CSS
                const newSize = baseSize * (currentFontSize / 100);
                storyText.style.fontSize = newSize + 'px';
                fontSizeDisplay.textContent = currentFontSize + '%';
                
                // Lưu vào localStorage
                localStorage.setItem('readerFontSize', currentFontSize);
            }
            
            // Khôi phục font size đã lưu
            const savedFontSize = localStorage.getItem('readerFontSize');
            if (savedFontSize) {
                currentFontSize = parseInt(savedFontSize);
                updateFontSize();
            }
            
            // Night mode toggle
            const nightBtn = document.getElementById('nightMode');
            nightBtn.addEventListener('click', () => {
                document.body.classList.toggle('force-dark');
                localStorage.setItem('readerDarkMode', 
                    document.body.classList.contains('force-dark')
                );
            });
            
            // Check saved dark mode
            if (localStorage.getItem('readerDarkMode') === 'true') {
                document.body.classList.add('force-dark');
            }
            
            // Copy chapter
            document.getElementById('copyChapter').addEventListener('click', async () => {
                try {
                    const text = storyText.innerText;
                    await navigator.clipboard.writeText(text);
                    alert('Đã sao chép nội dung chương!');
                } catch (err) {
                    console.error('Copy failed:', err);
                }
            });
            
            // Scroll to top
            document.getElementById('topBtn').addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            // Lưu scroll position
            window.addEventListener('scroll', () => {
                localStorage.setItem('readerScrollPos', window.scrollY);
            });
            
            // Khôi phục scroll position
            const savedScroll = localStorage.getItem('readerScrollPos');
            if (savedScroll) {
                setTimeout(() => {
                    window.scrollTo(0, parseInt(savedScroll));
                }, 100);
            }
            
            // Auto-hide controls
            let hideTimeout;
            function showControls() {
                document.getElementById('controlPanel').style.opacity = '1';
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    document.getElementById('controlPanel').style.opacity = '0.3';
                }, 3000);
            }
            
            document.addEventListener('mousemove', showControls);
            document.addEventListener('touchstart', showControls);
            showControls();
        });
    </script>
</body>
</html>
`;

class PageRewriter {
  constructor(requestUrl) {
    this.requestUrl = requestUrl;
    this.element = this.element.bind(this);
    this.text = this.text.bind(this);
  }

  element(element) {
    // Chỉ giữ lại body, loại bỏ mọi thứ khác
    if (element.tagName === 'head') {
      element.remove();
      return;
    }
    
    if (element.tagName === 'body') {
      // Giữ lại body nhưng xóa hết nội dung cũ
      element.setInnerContent(HTML_TEMPLATE, { html: true });
      return;
    }
    
    // Xóa mọi thứ khác
    element.remove();
  }

  text(text) {
    // Xóa toàn bộ text không cần thiết
    text.remove();
  }
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Nếu là trang chủ, chuyển đến /home
  if (url.pathname === '/') {
    return Response.redirect(`${url.origin}/home`);
  }
  
  const path = url.pathname + url.search;
  const targetUrl = `${TARGET_DOMAIN}${path}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type') || '';
    
    if (contentType.includes('text/html')) {
      const rewriter = new HTMLRewriter()
        .on('*', new PageRewriter(url));

      const rewritten = await rewriter.transform(response).text();
      
      // Xử lý thêm: tìm và trích xuất nội dung thực sự
      const processedHtml = await processHtmlContent(rewritten, targetUrl);
      
      return new Response(processedHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // Trả về nguyên bản cho các loại nội dung khác
    return response;
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(createErrorPage(error), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

async function processHtmlContent(html, targetUrl) {
  // Parse HTML để tìm nội dung chính
  const $ = new DOMParser();
  const doc = $.parseFromString(html, 'text/html');
  
  // Tìm tiêu đề chương
  let title = 'Đọc Truyện';
  const titleElements = [
    doc.querySelector('.tenbai'),
    doc.querySelector('h1'),
    doc.querySelector('title'),
    doc.querySelector('.phdr')
  ];
  
  for (const el of titleElements) {
    if (el && el.textContent.trim()) {
      title = el.textContent.trim();
      break;
    }
  }
  
  // Tìm nội dung truyện
  let content = 'Không tìm thấy nội dung.';
  const contentElements = [
    doc.querySelector('.noidungtruyen'),
    doc.querySelector('.content_block'),
    doc.querySelector('.bai-viet-box'),
    doc.querySelector('[class*="content"]'),
    doc.querySelector('[class*="noi-dung"]'),
    doc.querySelector('article'),
    doc.querySelector('main')
  ];
  
  for (const el of contentElements) {
    if (el && el.innerHTML.trim()) {
      content = el.innerHTML;
      break;
    }
  }
  
  // Clean content
  content = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
    .replace(/<br\s*\/?>/gi, '</p><p>')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  
  // Wrap paragraphs
  if (!content.includes('<p>')) {
    content = content.split('\n')
      .filter(line => line.trim())
      .map(line => `<p>${line.trim()}</p>`)
      .join('\n');
  }
  
  // Tìm link phân trang
  const navLinks = [];
  const paginationEl = doc.querySelector('.phantrang');
  if (paginationEl) {
    const links = paginationEl.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('page=')) {
        navLinks.push({
          text: link.textContent.trim(),
          href: href
        });
      }
    });
  }
  
  // Thay thế placeholder trong template
  let finalHtml = HTML_TEMPLATE
    .replace('Đang tải nội dung...', content)
    .replace('Đang tải...', title)
    .replace('Chương 1', title);
  
  // Thêm phân trang nếu có
  if (navLinks.length > 0) {
    const pageLinksHtml = navLinks.map(link => 
      `<a href="${link.href}" class="page-btn">${link.text}</a>`
    ).join('');
    finalHtml = finalHtml.replace('id="pageLinks"></div>', `id="pageLinks">${pageLinksHtml}</div>`);
  }
  
  return finalHtml;
}

function createErrorPage(error) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lỗi - Reader Mode</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .error-box {
        background: white;
        padding: 40px;
        border-radius: 20px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      }
      h1 {
        color: #e74c3c;
        margin-bottom: 20px;
      }
      .btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 30px;
        border-radius: 25px;
        text-decoration: none;
        display: inline-block;
        margin-top: 20px;
        font-weight: 600;
        transition: transform 0.3s ease;
      }
      .btn:hover {
        transform: translateY(-2px);
      }
    </style>
  </head>
  <body>
    <div class="error-box">
      <h1>📖 Reader Mode</h1>
      <p>Không thể tải nội dung truyện.</p>
      <p><small>${error.message}</small></p>
      <a href="/home" class="btn">Về trang chủ</a>
    </div>
  </body>
  </html>`;
}
