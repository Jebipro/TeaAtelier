// search.js - Supabase 버전 (중복 제거 포함)

// URL 쿼리 파라미터 읽기
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        tag: params.get('tag'),
        query: params.get('q'),
        type: params.get('type')
    };
}

// 중복 제거 함수
function removeDuplicates(results) {
    const seen = new Map();
    
    return results.filter(item => {
        // 이름 기반 키 생성
        const key = item. name.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '');
        
        if (seen.has(key)) {
            // 이미 있으면 우선순위 비교
            const existing = seen. get(key);
            
            // 제품(tea) > 페어링(pairing) > 산지(region) 순으로 우선순위
            const priority = { 'tea': 1, 'pairing': 2, 'region': 3 };
            
            if (priority[item.contentType] < priority[existing.contentType]) {
                seen.set(key, item);
                return true;
            }
            return false;
        }
        
        seen.set(key, item);
        return true;
    });
}

// Supabase 검색 실행
async function performSearch(query, tag, type) {
    try {
        console.log('🔍 검색 시작:', { query, tag, type });
        
        let results = [];
        
        // 1. teas 테이블 검색
        let teasQuery = window.supabaseClient.from('teas').select('*');
        
        if (query) {
            teasQuery = teasQuery.or(`name.ilike.%${query}%,name_en.ilike.%${query}%,description.ilike.%${query}%,origin.ilike.%${query}%`);
        }
        
        if (type) {
            teasQuery = teasQuery.eq('type', type);
        }
        
        const { data:  teasData, error:  teasError } = await teasQuery;
        
        if (! teasError && teasData) {
            results. push(...teasData.map(tea => ({
                ...tea,
                contentType: 'tea',
                category: `${tea.category} 🍵`,
                detailPage: tea.detail_page
            })));
        }
        
        // 2. pairings 테이블 검색
        let pairingsQuery = window.supabaseClient.from('pairings').select('*');
        
        if (query) {
            pairingsQuery = pairingsQuery.or(`name.ilike.%${query}%,name_en.ilike.%${query}%,description.ilike. %${query}%`);
        }
        
        const { data: pairingsData, error: pairingsError } = await pairingsQuery;
        
        if (!pairingsError && pairingsData) {
            results.push(... pairingsData.map(pairing => ({
                ...pairing,
                contentType: 'pairing',
                category: `${pairing.category || '페어링'} 🍰`,
                detailPage: pairing.detail_page
            })));
        }
        
        // 3. tea_regions 테이블 검색
        let regionsQuery = window. supabaseClient
            .from('tea_regions')
            .select('*');
        
        if (query) {
            // ⚠️ Supabase의 배열 검색은 제한적이므로 모든 데이터 가져오기
            // 클라이언트에서 필터링
        }
        
        const { data: regionsData, error: regionsError } = await regionsQuery;
        
        if (!regionsError && regionsData) {
            let filteredRegions = regionsData;
            
            // 검색어가 있으면 필터링
            if (query) {
                const queryLower = query.toLowerCase().trim();
                
                filteredRegions = regionsData. filter(region => {
                    // 기본 필드 검색
                    const basicMatch = 
                        region.name_ko?.toLowerCase().includes(queryLower) ||
                        region.name_en?.toLowerCase().includes(queryLower) ||
                        region.country?.toLowerCase().includes(queryLower) ||
                        region.tea_type?.toLowerCase().includes(queryLower) ||
                        region.description?.toLowerCase().includes(queryLower);
                    
                    // tags 배열 검색
                    const tagsMatch = region. tags?. some(tag => 
                        tag.toLowerCase().includes(queryLower)
                    );
                    
                    // search_keywords 배열 검색
                    const keywordsMatch = region.search_keywords?.some(kw => 
                        kw.toLowerCase().includes(queryLower)
                    );
                    
                    return basicMatch || tagsMatch || keywordsMatch;
                });
                
                console.log(`🗺️ tea_regions 필터링:  ${regionsData.length} → ${filteredRegions.length}`);
            }
            
            results.push(...filteredRegions.map(region => ({
                name: region.name_ko,
                nameEn: region. name_en,
                category:  `${region.tea_type} 🗺️`,
                description: region.description?.substring(0, 120) + '...',
                image: region.image_url,
                tags: region.tags || region.terroir_characteristics?.split(', ') || [],
                contentType: 'region',
                detailPage:  `/tea_profiling/region_detail.html?id=${region. id}`
            })));
        }
        
        // 태그 필터링
        if (tag) {
            results = results.filter(item => 
                item.tags && item.tags.some(t => 
                    t.toLowerCase().includes(tag.toLowerCase())
                )
            );
        }
        
        console.log('🔍 중복 제거 전:', results.length);
        
        // ✅ 중복 제거
        results = removeDuplicates(results);
        
        console.log('✅ 검색 결과:', results.length);
        return results;
        
    } catch (error) {
        console.error('❌ 검색 실패:', error);
        return [];
    }
}

// 결과 카드 렌더링
function renderResults(results) {
    const grid = document.getElementById('results-grid');
    const countEl = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    
    if (results.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        countEl.textContent = '';
        return;
    }
    
    grid. style.display = 'grid';
    noResults.style.display = 'none';
    countEl.textContent = `${results.length}개의 결과`;
    
    grid.innerHTML = results.map(item => `
        <a href="${item.detailPage || item.detail_page}" class="result-card">
            <div class="result-image">
                <img src="${item. image || '/resources/style/placeholder.jpg'}" 
                    alt="${item.name}" 
                    onerror="this. src='/resources/style/placeholder. jpg'">
            </div>
            <div class="result-content">
                <div class="category">${item.category || item.contentType}</div>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="result-tags">
                    ${item.tags ?  item.tags.slice(0, 5).map(tag => `<span>${tag}</span>`).join('') : ''}
                </div>
            </div>
        </a>
    `).join('');
}

// 활성 필터 표시
function renderActiveFilters(params) {
    const container = document.getElementById('active-filters');
    const filters = [];
    
    if (params. tag) {
        filters.push({ type: 'tag', value: params.tag, label: `태그: ${params.tag}` });
    }
    if (params.query) {
        filters.push({ type: 'query', value: params.query, label: `검색: ${params.query}` });
    }
    if (params.type) {
        filters.push({ type: 'type', value: params.type, label: `타입: ${params.type}` });
    }
    
    if (filters. length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    container.innerHTML = filters.map(filter => `
        <div class="filter-tag">
            ${filter.label}
            <span class="remove" onclick="removeFilter('${filter. type}')">✕</span>
        </div>
    `).join('');
}

// 필터 제거
function removeFilter(type) {
    const params = new URLSearchParams(window.location. search);
    params.delete(type === 'query' ? 'q' : type);
    window.location.search = params.toString();
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 검색 페이지 로드');
    
    // Supabase 연결 확인
    if (!window.supabaseClient) {
        console.error('❌ Supabase 클라이언트가 없습니다!');
        document.getElementById('no-results').style.display = 'block';
        document.getElementById('no-results').innerHTML = `
            <h2>오류 발생</h2>
            <p>데이터베이스 연결에 실패했습니다. </p>
        `;
        return;
    }
    
    // URL 파라미터 읽기
    const params = getQueryParams();
    
    // 검색 실행
    const results = await performSearch(params. query, params.tag, params. type);
    
    // 결과 렌더링
    renderResults(results);
    renderActiveFilters(params);
    
    // 검색 입력창에 기존 검색어 표시
    const searchInput = document.getElementById('search-input');
    if (params.query) {
        searchInput.value = params.query;
    }
    
    // 검색 버튼 클릭
    document.getElementById('search-btn').addEventListener('click', function() {
        const query = searchInput. value.trim();
        if (query) {
            const newParams = new URLSearchParams(window. location.search);
            newParams.set('q', query);
            window.location.search = newParams.toString();
        }
    });
    
    // 엔터 키로 검색
    searchInput. addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('search-btn').click();
        }
    });
});