// scripts.js (LNB 스크롤/배경 토글 제거 버전)
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const megaMenu = document.querySelector('.mega-menu-wrapper');
    const mainMenuLinks = document.querySelectorAll('.gnb ul li a');
    const languageSwitcherLink = document.getElementById('language-switcher-link');
    const languageFlagImg = document.getElementById('language-flag-img');

    // (참고) horizontalLNB는 더 이상 스크롤에 따라 .scrolled를 토글하지 않습니다.
    // const horizontalLNB = document.querySelector('.horizontal-lnb-wrapper');

    // 스크롤 임계값 (헤더만 사용)
    const GNB_SCROLL_THRESHOLD = 80;

    const flagPaths = {
        'KOR': '/resources/style/korea.png',
        'ENG': '/resources/style/usa.png'
    };
    let currentLang = 'KOR';

    const getCurrentFileName = () => {
        const path = window.location.pathname;
        let file = path.substring(path.lastIndexOf('/') + 1);
        if (!file) file = 'index.html';
        return file;
    };

    const initializeFlag = () => {
        const file = getCurrentFileName();
        if (!languageFlagImg) return;
        if (file.includes('_en.html')) {
            currentLang = 'ENG';
            languageFlagImg.src = flagPaths['ENG'];
            languageFlagImg.alt = 'English';
        } else {
            currentLang = 'KOR';
            languageFlagImg.src = flagPaths['KOR'];
            languageFlagImg.alt = '한국어';
        }
    };

    if (languageFlagImg) initializeFlag();

    // GNB 드롭다운: hover/focus 작동
    if (header && megaMenu) {
        header.addEventListener('mouseenter', function() {
            megaMenu.classList.add('is-active');
        });
        header.addEventListener('mouseleave', function() {
            megaMenu.classList.remove('is-active');
        });
        header.addEventListener('focusin', function() {
            megaMenu.classList.add('is-active');
        });
        header.addEventListener('focusout', function() {
            if (!header.contains(document.activeElement)) {
                megaMenu.classList.remove('is-active');
            }
        });
    }

    // GNB 클릭: 드롭다운 열려있으면 닫기
    mainMenuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const isDropdownActive = megaMenu && megaMenu.classList.contains('is-active');
            if (isDropdownActive) {
                event.preventDefault();
                megaMenu.classList.remove('is-active');
            }
        });
    });

    // 언어 전환
    if (languageSwitcherLink) {
        languageSwitcherLink.addEventListener('click', function(event) {
            event.preventDefault();
            const targetLang = (currentLang === 'KOR') ? 'ENG' : 'KOR';
            const file = getCurrentFileName();
            const base = file.replace(/(_en)?\.html$/, '');
            const target = (targetLang === 'ENG') ? base + '_en.html' : base + '.html';
            const currentPath = window.location.pathname;
            const newPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1) + target;
            window.location.href = newPath;
        });
    }

    // 스크롤 이벤트: 헤더만 처리 (LNB는 더 이상 여기에서 토글하지 않음)
    const onScroll = () => {
        const scrollPosition = window.scrollY;

        if (header) {
            if (scrollPosition > GNB_SCROLL_THRESHOLD) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Active 관리: GNB와 수평 LNB ---
    const currentFile = getCurrentFileName().toLowerCase();

    const gnbGroups = {
        'philosophy_vision.html': [
            'brand_vision.html',
            'craftsmanship.html',
            'ethics_management.html',
            'directions.html'
        ],
        'tea_profiling.html': [
            'the-six-tea.html',
            'tea_of_the_month.html',
            'brewing_guide.html',
            'teas_by_region.html'
        ],
        'pairing_blending.html': [
            'tea_food_pairing.html',
            'blending_lab.html',
            'seasonal_pairings.html'
        ],
        'culture_news.html': [
            'tea_culture_magazine.html',
            'notices.html',
            'faq_contact.html',
            'media_press.html'
        ],
        'index.html': [
            'index.html',
            'index_en.html'
        ]
    };

    // GNB active 설정
    document.querySelectorAll('.gnb a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        let setActive = false;
        for (const [groupRoot, files] of Object.entries(gnbGroups)) {
            if (files.includes(currentFile) && href === groupRoot) {
                a.classList.add('active');
                setActive = true;
                break;
            }
        }
        if (!setActive) a.classList.remove('active');
    });

    // LNB(active) 설정은 href와 현재 파일명 비교만 수행 (스크롤 관련 클래스 변경 없음)
    document.querySelectorAll('.horizontal-lnb a, .sidebar-nav a, .lnb-list a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        if (!href) {
            a.classList.remove('active');
            return;
        }
        if (href === currentFile || (currentFile === 'index.html' && href === 'tea_of_the_month.html')) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });

});