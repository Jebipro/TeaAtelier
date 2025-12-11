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

    // 필터 버튼 클릭 이벤트
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 버튼 active 상태 변경
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // 미디어 카드 필터링
            document.querySelectorAll('.media-card').forEach(card => {
                if (filter === 'all') {
                    card.style. display = 'block';
                } else if (card.dataset.year === filter || card.dataset.category === filter) {
                    card.style. display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // FAQ 아코디언 기능
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.icon').textContent = '+';
            });
            
            if (!isActive) {
                    faqItem.classList.add('active');
                    question.querySelector('.icon').textContent = '−';
            }
        });
    });

    // 카테고리 필터 기능
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const searchInput = document.getElementById('faqSearchInput');
            searchInput.value = '';
            document.getElementById('clearSearchBtn').style.display = 'none';
            removeHighlights();
            
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            removeNoResultsMessage();
            
            let visibleCount = 0;
            document.querySelectorAll('.faq-item').forEach(item => {
                if (category === 'all' || item. dataset.category === category) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                    item.querySelector('.icon').textContent = '+';
                }
            });
            
            updateResultCount(visibleCount, false);
        });
    });

    // 검색 기능
    const searchInput = document.getElementById('faqSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        clearBtn.style.display = searchTerm ? 'block' : 'none';
        removeHighlights();
        removeNoResultsMessage();
        
        if (! searchTerm) {
            document.querySelectorAll('.faq-item').forEach(item => {
                item.style.display = 'block';
            });
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
            updateResultCount(document.querySelectorAll('.faq-item').length, false);
            return;
        }
        
        let visibleCount = 0;
        let firstVisibleItem = null;
        
        document.querySelectorAll('.faq-item').forEach(item => {
            const questionEl = item.querySelector('.faq-question');
            const answerEl = item.querySelector('.faq-answer');
            
            const questionText = questionEl.textContent. toLowerCase();
            const answerText = answerEl.textContent.toLowerCase();
            
            if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                item.style.display = 'block';
                visibleCount++;
                
                if (! firstVisibleItem) {
                    firstVisibleItem = item;
                }
                
                // 답변에만 하이라이팅 적용
                highlightText(answerEl, searchTerm);
                
            } else {
                item.style.display = 'none';
                item. classList.remove('active');
                item.querySelector('.icon').textContent = '+';
            }
        });
        
        updateResultCount(visibleCount, true, searchTerm);
        
        if (visibleCount === 0) {
            showNoResultsMessage(searchTerm);
        } else {
            if (firstVisibleItem) {
                firstVisibleItem.classList. add('active');
                firstVisibleItem. querySelector('.icon').textContent = '−';
            }
        }
        
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    });
    
    // 초기화 버튼
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        removeHighlights();
        removeNoResultsMessage();
        
        document.querySelectorAll('.faq-item').forEach(item => {
            item.style. display = 'block';
            item.classList.remove('active');
            item.querySelector('.icon').textContent = '+';
        });
        
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
        
        updateResultCount(document.querySelectorAll('.faq-item').length, false);
        searchInput.focus();
    });
    
    // 하이라이팅 함수 (답변에만 적용)
        function highlightText(element, searchTerm) {
        const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
        const textContent = element.textContent;
        const highlightedHTML = textContent.replace(regex, '<span class="highlight">$1</span>');
        element.innerHTML = highlightedHTML;
    }
    
    // 하이라이팅 제거
    function removeHighlights() {
        document.querySelectorAll('.highlight').forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }
    
    // 정규식 이스케이프
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 결과 개수 업데이트
    function updateResultCount(count, isSearch, searchTerm = '') {
        const countEl = document.getElementById('searchResultCount');
        if (isSearch) {
            countEl.innerHTML = `"<strong>${searchTerm}</strong>" 검색 결과:  <span class="count">${count}개</span>`;
        } else {
            countEl.innerHTML = `총 <span class="count">${count}개</span>의 FAQ`;
        }
    }
    
    // 빈 결과 메시지
    function showNoResultsMessage(searchTerm) {
        removeNoResultsMessage();
        
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.id = 'noResultsMessage';
        noResultsDiv.innerHTML = `
            <h3>🔍 검색 결과가 없습니다</h3>
            <p>"${searchTerm}"에 대한 FAQ를 찾을 수 없습니다.</p>
            <p style="margin-top: 10px; color: #4F7B60;">다른 키워드로 검색하시거나, 아래 <strong>1: 1 문의</strong>를 이용해주세요.</p>
        `;
        
        document.querySelector('.faq-accordion').appendChild(noResultsDiv);
    }
    
    function removeNoResultsMessage() {
        const existing = document.getElementById('noResultsMessage');
        if (existing) {
            existing.remove();
        }
    }
    
    // 초기 로드
    document.addEventListener('DOMContentLoaded', () => {
        const totalCount = document.querySelectorAll('.faq-item').length;
        updateResultCount(totalCount, false);
    });
    // 폼 제출 처리 (Supabase 연동)
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e. target);
        const message = formData.get('message');

        // 클라이언트 검증
        if (message.length < 10) {
            alert('문의 내용을 최소 10자 이상 입력해주세요.');
            return;
        }

        // 제출 버튼 비활성화
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';

        try {
            // Supabase에 데이터 삽입
            const { data, error } = await supabase
                .from('contact_inquiries')
                .insert([
                    {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        phone: formData.get('phone') || null,
                        category:  formData.get('category'),
                        subject: formData.get('subject'),
                        message:  formData.get('message')
                    }
                ])
                .select();
                
            if (error) {
                throw error;
            }
        
            // 성공
            console.log('저장된 데이터:', data);
            alert('✅ 문의가 성공적으로 접수되었습니다!\n영업일 기준 24시간 내에 답변드리겠습니다.');
            e.target.reset();
        
        } catch (error) {
            console.error('Error:', error);
            alert('❌ 전송 중 오류가 발생했습니다.\n' + error.message);
        } finally {
            // 버튼 복구
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});