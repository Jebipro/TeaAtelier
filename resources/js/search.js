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
        const key = item.name.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '');
        
        if (seen.has(key)) {
            // 이미 있으면 우선순위 비교
            const existing = seen.get(key);
            
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
        const { data: teasData, error: teasError } = await window.supabaseClient
            .from('teas')
            .select('*');
        
        if (teasError) {
            console.error('❌ teas 오류:', teasError);
        } else if (teasData) {
            // 클라이언트 측 필터링
            let filteredTeas = teasData;
            
            if (query) {
                const queryLower = query.toLowerCase().trim();
                filteredTeas = teasData. filter(tea => {
                    const basicMatch = 
                        tea.name?. toLowerCase().includes(queryLower) ||
                        tea.name_en?.toLowerCase().includes(queryLower) ||
                        tea. category?.toLowerCase().includes(queryLower) ||
                        tea.description?.toLowerCase().includes(queryLower) ||
                        tea.origin?.toLowerCase().includes(queryLower);
                    
                    const tagsMatch = tea.tags?. some(t => 
                        t.toLowerCase().includes(queryLower)
                    );
                    
                    const keywordsMatch = tea.search_keywords?.some(kw => 
                        kw.toLowerCase().includes(queryLower)
                    );
                    
                    return basicMatch || tagsMatch || keywordsMatch;
                });
            }
            
            if (type) {
                filteredTeas = filteredTeas.filter(tea => tea.type === type);
            }
            
            console.log(`🍵 teas: ${teasData.length} → ${filteredTeas.length}`);
            
            results.push(...filteredTeas.map(tea => ({
                ...tea,
                contentType: 'tea',
                category: `${tea.category} 🍵`,
                detailPage: tea.detail_page
            })));
        }
        
        // 2. pairings 테이블 검색
        const { data: pairingsData, error: pairingsError } = await window.supabaseClient
            .from('pairings')
            .select('*');
        
        if (pairingsError) {
            console.error('❌ pairings 오류:', pairingsError);
        } else if (pairingsData) {
            let filteredPairings = pairingsData;
            
            if (query) {
                const queryLower = query.toLowerCase().trim();
                filteredPairings = pairingsData. filter(pairing => {
                    const basicMatch = 
                        pairing.name?.toLowerCase().includes(queryLower) ||
                        pairing.name_en?.toLowerCase().includes(queryLower) ||
                        pairing.description?.toLowerCase().includes(queryLower) ||
                        pairing.category?.toLowerCase().includes(queryLower);
                    
                    const tagsMatch = pairing.tags?. some(t => 
                        t.toLowerCase().includes(queryLower)
                    );
                    
                    const keywordsMatch = pairing.search_keywords?.some(kw => 
                        kw.toLowerCase().includes(queryLower)
                    );
                    
                    return basicMatch || tagsMatch || keywordsMatch;
                });
            }
            
            console. log(`🍰 pairings: ${pairingsData.length} → ${filteredPairings.length}`);
            
            results.push(... filteredPairings.map(pairing => ({
                ...pairing,
                contentType: 'pairing',
                category: `${pairing.category || '페어링'} 🍰`,
                detailPage: pairing.detail_page
            })));
        }
        
        // 3. tea_regions 테이블 검색
        const { data: regionsData, error: regionsError } = await window.supabaseClient
            . from('tea_regions')
            .select('*');
        
        if (regionsError) {
            console.error('❌ tea_regions 오류:', regionsError);
        } else if (regionsData) {
            let filteredRegions = regionsData;
            
            if (query) {
                const queryLower = query.toLowerCase().trim();
                filteredRegions = regionsData.filter(region => {
                    const basicMatch = 
                        region.name_ko?.toLowerCase().includes(queryLower) ||
                        region. name_en?.toLowerCase().includes(queryLower) ||
                        region.country?.toLowerCase().includes(queryLower) ||
                        region.tea_type?.toLowerCase().includes(queryLower) ||
                        region.description?.toLowerCase().includes(queryLower) ||
                        region.terroir_characteristics?.toLowerCase().includes(queryLower);
                    
                    const tagsMatch = region.tags?.some(t => 
                        t.toLowerCase().includes(queryLower)
                    );
                    
                    const keywordsMatch = region.search_keywords?.some(kw => 
                        kw.toLowerCase().includes(queryLower)
                    );
                    
                    return basicMatch || tagsMatch || keywordsMatch;
                });
            }
            
            console.log(`🗺️ tea_regions: ${regionsData.length} → ${filteredRegions.length}`);
            
            results.push(...filteredRegions.map(region => ({
                name: region.name_ko,
                nameEn: region.name_en,
                category: `${region.tea_type} 🗺️`,
                description: region.description?.substring(0, 120) + '...',
                image: region.image_url,
                tags: region. tags || region.terroir_characteristics?.split(', ') || [],
                contentType: 'region',
                detailPage: `/tea_profiling/region_detail.html?id=${region.id}`
            })));
        }
        
        // 태그 필터링
        if (tag) {
            const tagLower = tag.toLowerCase();
            results = results.filter(item => {
                if (Array.isArray(item.tags)) {
                    return item.tags.some(t => t.toLowerCase().includes(tagLower));
                }
                return false;
            });
        }
        
        console.log('🔍 중복 제거 전:', results.length);
        
        // 중복 제거
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
                    ${item.tags ? item.tags.slice(0, 5).map(tag => `<span>${tag}</span>`).join('') : ''}
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