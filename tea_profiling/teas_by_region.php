<?php
// 데이터베이스 설정 파일 포함
require_once '../includes/db_config.php';

try {
    $pdo = getDBConnection();
    
    // 전체 산지 조회
    $stmt = $pdo->query("SELECT * FROM tea_regions ORDER BY id ASC");
    $regions = $stmt->fetchAll();
    
} catch(Exception $e) {
    die("데이터 조회 실패: " . $e->getMessage());
}
?>
<! DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Tea Atelier | 산지별 티</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=GFS+Didot&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="/TeaAtelier/resources/css/styles.css"> 
    <link rel="stylesheet" href="/TeaAtelier/resources/css/subpage.css">
</head>
<body>

    <!-- 1.  HEADER 영역 -->
    <header>
        <div class="nav-container">
            <div class="logo">
                <a href="/TeaAtelier/index.html">The Tea Atelier</a>
            </div>

            <nav class="gnb">
                <ul>
                    <li><a href="/TeaAtelier/philosophy/brand_vision.html">우리의 철학</a></li>
                    <li><a href="/TeaAtelier/tea_profiling/the_six_tea. html">티 프로파일링</a></li>
                    <li><a href="/TeaAtelier/pairing/tea_food_pairing.html">페어링 &amp; 블렌딩</a></li>
                    <li><a href="/TeaAtelier/culture/tea_culture_magazine.html">문화 &amp; 소식</a></li>
                </ul>
            </nav>

            <div class="utility">
                <img src="/TeaAtelier/resources/style/black_search.png" alt="검색" class="search-icon">
                <div class="lang-switcher">
                    <a href="#" id="language-switcher-link">
                        <img src="/TeaAtelier/resources/style/korea. png" alt="한국어" class="flag-icon" id="language-flag-img">
                    </a>
                </div>
            </div>
        </div>
        
        <!-- MEGA DROP DOWN WRAPPER -->
        <div class="mega-menu-wrapper">
            <div class="mega-menu-inner-content">
                <div class="mega-menu-spacer-left">
                    <div class="logo" style="visibility: hidden;">
                        <a href="index.html">The Tea Atelier</a>
                    </div>
                </div>
                <div class="sub-menu-columns-row">
                    <div class="sub-menu-column">
                        <a href="/TeaAtelier/philosophy/brand_vision.html">브랜드 비전</a>
                        <a href="/TeaAtelier/philosophy/craftsmanship.html">장인 정신</a>
                        <a href="/TeaAtelier/philosophy/ethics_management.html">윤리 경영</a>
                        <a href="/TeaAtelier/philosophy/directions.html">오시는 길</a>
                    </div>
                    <div class="sub-menu-column">
                        <a href="/TeaAtelier/tea_profiling/the_six_tea. html">6대 다류</a>
                        <a href="/TeaAtelier/tea_profiling/tea_of_the_month.html">이달의 차(茶)</a>
                        <a href="/TeaAtelier/tea_profiling/brewing_guide.html">브루잉 가이드</a>
                        <a href="/TeaAtelier/tea_profiling/teas_by_region.php">산지별 티</a>
                    </div>
                    <div class="sub-menu-column">
                        <a href="/TeaAtelier/pairing/tea_food_pairing.html">티 푸드 페어링</a>
                        <a href="/TeaAtelier/pairing/blending_lab.html">블렌딩 연구소</a>
                        <a href="/TeaAtelier/pairing/seasonal_pairings.html">시즌별 페어링</a>
                    </div>
                    <div class="sub-menu-column">
                        <a href="/TeaAtelier/culture/tea_culture_magazine.html">티 문화 매거진</a>
                        <a href="/TeaAtelier/culture/notices.html">공지사항</a>
                        <a href="/TeaAtelier/culture/faq_contact.html">FAQ &amp; 문의</a>
                        <a href="/TeaAtelier/culture/media_press.html">미디어 &amp; 보도</a>
                    </div>
                </div>
                <div class="mega-menu-spacer-right">
                    <div class="utility" style="visibility: hidden;">
                        <img src="/TeaAtelier/resources/style/black_search.png" alt="검색" class="search-icon">
                        <div class="lang-switcher">
                            <img src="/TeaAtelier/resources/style/korea.png" alt="한국어" class="flag-icon" id="language-flag">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- 2. MAIN 콘텐츠 영역 -->
    <main>
        <div class="page-header">
            <h1>티 프로파일링</h1>
            <p>Tea Profiling:  The Comprehensive Archive of Tea Knowledge</p>
        </div>
        
        <div class="horizontal-lnb-wrapper">
            <nav class="horizontal-lnb">
                <ul>
                    <li><a href="the_six_tea.html">6대 다류</a></li>
                    <li><a href="tea_of_the_month.html">이달의 차(茶)</a></li>
                    <li><a href="brewing_guide.html">브루잉 가이드</a></li>
                    <li class="active"><a href="teas_by_region.php">산지별 티</a></li>
                </ul>
            </nav>
        </div>
        
        <div class="breadcrumb-wrapper">
            <div class="breadcrumb">
                <a href="/TeaAtelier/index.html">HOME</a>
                <span>&gt;</span>
                <a href="the_six_tea.html">티 프로파일링</a>
                <span>&gt;</span>
                <span class="current-page">산지별 티</span>
            </div>
        </div>
        
        <div class="sub-page-container">
            <section id="origin-map-section" class="content-section" style="border-bottom: none;">
                <h2>전 세계 다원(茶園) 지도 및 떼루아(Terroir) 이해</h2>
                <p class="intro-text" style="text-align: center; max-width: 800px; margin: 0 auto 50px;">
                    차의 품질은 토양, 기후, 고도 등 산지의 자연적 환경(떼루아)에 의해 좌우됩니다. 각 산지를 클릭하여 상세 정보를 확인하세요.
                </p>
                
                <!-- 세계 지도 (선택사항) -->
                <div class="origin-map-container" style="margin-bottom: 60px;">
                    <img src="/TeaAtelier/resources/style/world_tea_map.png" alt="세계 주요 차 산지 지도" style="width: 100%; border-radius: 12px;">
                </div>
                
                <!-- 산지 카드 그리드 (데이터베이스에서 동적 생성) -->
                <div class="origin-highlight-grid">
                    <?php foreach($regions as $region): ?>
                    <a href="region_detail.php? id=<?= $region['id'] ?>" class="origin-card-link">
                        <div class="origin-card">
                            <div class="origin-card-image">
                                <img src="<?= htmlspecialchars($region['image_url']) ?>" 
                                    alt="<?= htmlspecialchars($region['name_ko']) ?> 차밭"
                                    onerror="this.src='/TeaAtelier/resources/style/placeholder_tea.jpg'">
                            </div>
                            <div class="origin-card-content">
                                <h3><?= htmlspecialchars($region['name_en']) ?></h3>
                                <p class="region">
                                    <?= $region['country_flag'] ?> 
                                    <?= htmlspecialchars($region['country']) ?> | 
                                    <?= htmlspecialchars($region['tea_type']) ?>
                                </p>
                                <p class="location">
                                    📍 <?= htmlspecialchars($region['altitude']) ?> | 
                                    <?= htmlspecialchars($region['climate']) ?>
                                </p>
                                <p class="description">
                                    <?= htmlspecialchars(mb_substr($region['description'], 0, 120)) ?>...
                                </p>
                                <div class="terroir-tags">
                                    <?php 
                                    $tags = explode(', ', $region['terroir_characteristics']);
                                    foreach($tags as $tag): 
                                    ?>
                                        <span class="tag"><?= htmlspecialchars($tag) ?></span>
                                    <?php endforeach; ?>
                                </div>
                                <span class="read-more">자세히 보기 →</span>
                            </div>
                        </div>
                    </a>
                    <?php endforeach; ?>
                </div>
            </section>
        </div>
    </main>

    <!-- 3. FOOTER 영역 -->
    <footer>
        <div class="footer-wrapper">
            
            <div class="footer-column footer-info">
                <h3 class="footer-logo">The Tea Atelier</h3>
                <p>대표: 김홍차 | 사업자등록번호: 123-45-67890</p>
                <p>주소: 전남 순천시 중앙로 255 | 이메일: contact@theteaatelier.com</p>
                <p>고객센터: 1544-XXXX (평일 10:00 ~ 17:00)</p>
                <p class="copyright">© 2025 The Tea Atelier. All rights reserved.</p>
            </div>

            <div class="footer-column footer-links">
                <h4>사이트맵</h4>
                <ul>
                    <li><a href="/TeaAtelier/philosophy/brand_vision.html">우리의 철학</a></li>
                    <li><a href="/TeaAtelier/tea_profiling/the_six_tea.html">티 프로파일링</a></li>
                    <li><a href="/TeaAtelier/pairing/tea_food_pairing.html">페어링 & 블렌딩</a></li>
                    <li><a href="/TeaAtelier/culture/tea_culture_magazine.html">문화 & 소식</a></li>
                </ul>
            </div>
            
            <div class="footer-column footer-legal">
                <h4>Legal & Support</h4>
                <ul>
                    <li><a href="#">이용약관</a></li>
                    <li><a href="#">개인정보처리방침</a></li>
                    <li><a href="#">법적고지</a></li>
                    <li><a href="/TeaAtelier/culture/faq_contact.html">FAQ & 문의</a></li>
                </ul>
                <div class="social-links">
                    <a href="https://www.instagram.com" target="_blank" class="social-icon" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M320.3 205C256.8 204. 8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245. 3C360.7 245.5 393.8 278.8 393.5 319.8C393.3 360.8 360 393.9 319 393.7C278 393.5 244.9 360.2 245.2 319.2C245.4 278.2 278.7 245.1 319.7 245.3zM433.5 173.5C445.3 173.5 454.8 183.1 454.8 194.8C454.8 206.5 445.2 216.1 433.5 216.1C421.8 216.1 412.2 206.5 412.2 194.8C412.2 183.1 421.8 173.5 433.5 173.5zM320 101C397.3 101 476 97.7 512. 7 134.4C549.4 171.1 539 242.2 539 320C539 398.5 549.9 469.4 512.7 505.6C475.5 541.8 405.2 539 320 539C241.5 539 170.6 548.9 134.4 512.7C98.2 476.5 101 406.2 101 321C101 242.7 91.1 171.8 128.3 134.4C165.5 97 235.8 101 320 101zM320 128C242.9 128 230.6 125.1 197.2 139.5C163.8 153.9 139.5 178.2 125.1 211.6C110.7 245 128 267.9 128 320C128 397.1 125.1 409.4 139.5 442.8C153.9 476.2 178.2 500.5 211.6 514.9C245 529.3 267.9 512 320 512C397.1 512 409.4 514.9 442.8 500.5C476.2 486.1 500.5 461.8 514.9 428.4C529.3 395 512 372.1 512 320C512 242.9 514.9 230.6 500.5 197.2C486.1 163.8 461.8 139.5 428.4 125.1C395 110.7 372.1 128 320 128z"/>
                        </svg>
                    </a>
                    <a href="https://x.com" target="_blank" class="social-icon" aria-label="X (Twitter)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M453.2 112L523.8 112L369.6 288. 2L551 528L409 528L297. 7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L217.6 152.2L175.8 152.2L428.4 485.8z"/>
                        </svg>
                    </a>
                    <a href="https://www.youtube.com" target="_blank" class="social-icon" aria-label="YouTube">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320. 1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.1 47 320.1C47 320.1 47 409.2 58.4 452.1C64.6 475.8 83.2 494.4 106.7 500.7C149.2 512. 2 320 512.2 320 512.2C320 512.2 490.8 512.2 533.4 500.7C556.9 494.5 575.4 475.9 581.7 452.2C593.1 409.3 593.1 320.2 593.1 320.2C593.1 320.2 593.1 231. 1 581.7 188.1zM265.2 398.5L265.2 241.7L408.1 320.1L265.2 398.5z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <script src="/TeaAtelier/resources/js/scripts.js"></script>
</body>
</html>