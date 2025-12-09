// scripts.js (LNB 스크롤/활성화 처리 — 수정본)
// 주요 변경:
// - currentFile과 href 비교 시 하이픈(-)을 언더스코어(_)로 정규화해서 비교
// - gnbGroups를 디렉터리(그룹) 기준으로 구성하고, href가 해당 디렉터리를 포함하는지 확인

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const megaMenu = document.querySelector('.mega-menu-wrapper');
    const mainMenuLinks = document.querySelectorAll('.gnb ul li a');
    const languageSwitcherLink = document.getElementById('language-switcher-link');
    const languageFlagImg = document.getElementById('language-flag-img');

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
        return file.toLowerCase();
    };

    // currentFile을 언더스코어 형태로 정규화해서 비교에 사용
    const normalizeName = (name) => {
        if (!name) return name;
        return name.toLowerCase().replace(/-/g, '_').replace(/^\//, '');
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

    // mainMenuLinks 클릭 시 드롭다운 닫기 동작
    mainMenuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const isDropdownActive = megaMenu && megaMenu.classList.contains('is-active');
            if (isDropdownActive) {
                event.preventDefault();
                megaMenu.classList.remove('is-active');
                // 링크로 이동하려면 잠깐 후에 이동
                const href = link.getAttribute('href');
                if (href) {
                    setTimeout(() => { window.location.href = href; }, 150);
                }
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

    // 스크롤 처리 (헤더 scrolled 클래스)
    const onScroll = () => {
        const scrollPosition = window.scrollY;
        if (header) {
            if (scrollPosition > GNB_SCROLL_THRESHOLD) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Active 관리: GNB와 LNB ---
    // 현재 파일명 (정규화)
    const currentFile = normalizeName(getCurrentFileName());

    // 그룹을 디렉터리(폴더) 기반으로 정의 — 실제 파일명(언더스코어)으로 맞춤
    const gnbGroups = {
        'philosophy': [
            'brand_vision.html',
            'craftsmanship.html',
            'ethics_management.html',
            'directions.html'
        ],
        'tea_profiling': [
            'the_six_tea.html',
            'tea_of_the_month.html',
            'brewing_guide.html',
            'teas_by_region.html'
        ],
        'pairing': [
            'tea_food_pairing.html',
            'blending_lab.html',
            'seasonal_pairings.html'
        ],
        'culture': [
            'tea_culture_magazine.html',
            'notices.html',
            'faq_contact.html',
            'media_press.html'
        ],
        'index': [
            'index.html',
            'index_en.html'
        ]
    };

    // GNB active 설정: 각 GNB 링크(href)에 포함된 디렉터리명으로 판정하거나,
    // href의 파일명이 현재 파일과 같은 그룹에 속하면 활성화
    document.querySelectorAll('.gnb a').forEach(a => {
        const hrefRaw = (a.getAttribute('href') || '').toLowerCase();
        const hrefFile = normalizeName(hrefRaw.substring(hrefRaw.lastIndexOf('/') + 1));
        let setActive = false;

        for (const [groupDir, files] of Object.entries(gnbGroups)) {
            // 현재 파일이 이 그룹에 속하는지 확인
            const filesNormalized = files.map(f => normalizeName(f));
            if (filesNormalized.includes(currentFile)) {
                // 1) 링크 href가 그룹 디렉터리를 포함하면 활성화
                if (hrefRaw.includes(`/${groupDir}/`) || hrefRaw.includes(`/${groupDir}`)) {
                    a.classList.add('active');
                    setActive = true;
                    break;
                }
                // 2) 또는 링크의 파일명이 그룹 내 파일명과 일치하면 활성화
                if (hrefFile && filesNormalized.includes(hrefFile)) {
                    a.classList.add('active');
                    setActive = true;
                    break;
                }
            }
        }

        if (!setActive) a.classList.remove('active');
    });

    // LNB / sidebar / lnb-list 활성화: href의 파일명과 현재 파일 비교 (정규화)
    document.querySelectorAll('.horizontal-lnb a, .sidebar-nav a, .lnb-list a').forEach(a => {
        const hrefRaw = (a.getAttribute('href') || '').toLowerCase();
        const hrefFile = normalizeName(hrefRaw.substring(hrefRaw.lastIndexOf('/') + 1));
        if (!hrefFile) {
            a.classList.remove('active');
            return;
        }
        if (hrefFile === currentFile || (currentFile === 'index.html' && hrefFile === 'tea_of_the_month.html')) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });

    // 검색 아이콘 클릭
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            window.location.href = '/search.html';
        });
        searchIcon.style.cursor = 'pointer';
    }

});