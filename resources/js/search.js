// search.js - 검색 및 필터 로직
let teaData = null;

// JSON 데이터 로드
async function loadData() {
    try {
        const response = await fetch('/resources/data/tea_data.json');
        teaData = await response.json();
        return teaData;
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        return { teas: [], pairings: [] };
    }
}

// URL 쿼리 파라미터 읽기
function getQueryParams() {
    const params = new URLSearchParams(window.location. search);
    return {
        tag: params.get('tag'),
        query: params.get('q'),
        type: params.get('type')
    };
}

// 검색 실행
function performSearch(query, tag, type) {
    if (!teaData) return [];
    
    let results = [];
    
    // 모든 항목 합치기
    const allItems = [
        ...teaData.teas.map(item => ({ ...item, contentType: 'tea' })),
        ...teaData.pairings.map(item => ({ ...item, contentType: 'pairing' }))
    ];
    
    // 필터링
    results = allItems.filter(item => {
        let match = true;
        
        // 태그 필터
        if (tag) {
            match = match && item.tags && item.tags.some(t => 
                t.toLowerCase().includes(tag.toLowerCase())
            );
        }
        
        // 타입 필터
        if (type) {
            match = match && (item.type === type || item.teaType === type);
        }
        
        // 텍스트 검색
        if (query) {
            const searchLower = query.toLowerCase();
            match = match && (
                (item.name && item.name.toLowerCase().includes(searchLower)) ||
                (item.nameEn && item.nameEn. toLowerCase().includes(searchLower)) ||
                (item.description && item.description.toLowerCase().includes(searchLower)) ||
                (item.searchKeywords && item.searchKeywords.some(kw => kw.includes(searchLower)))
            );
        }
        
        return match;
    });
    
    return results;
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
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    countEl.textContent = `${results.length}개의 결과`;
    
    grid.innerHTML = results.map(item => `
        <a href="${item.detailPage}" class="result-card">
            <div class="result-image">
                <img src="${item.image || '/resources/style/placeholder.jpg'}" 
                    alt="${item.name}" 
                    onerror="this.src='/resources/style/placeholder.jpg'">
            </div>
            <div class="result-content">
                <div class="category">${item.category || item.contentType}</div>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="result-tags">
                    ${item.tags ?  item.tags.map(tag => `<span>${tag}</span>`).join('') : ''}
                </div>
            </div>
        </a>
    `).join('');
}

// 활성 필터 표시
function renderActiveFilters(params) {
    const container = document.getElementById('active-filters');
    const filters = [];
    
    if (params.tag) {
        filters.push({ type: 'tag', value: params.tag, label: `태그: ${params.tag}` });
    }
    if (params.query) {
        filters.push({ type: 'query', value: params.query, label: `검색: ${params.query}` });
    }
    if (params.type) {
        filters.push({ type: 'type', value: params.type, label: `타입: ${params.type}` });
    }
    
    if (filters. length === 0) {
        container. style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    container.innerHTML = filters.map(filter => `
        <div class="filter-tag">
            ${filter.label}
            <span class="remove" onclick="removeFilter('${filter.type}')">✕</span>
        </div>
    `).join('');
}

// 필터 제거
function removeFilter(type) {
    const params = new URLSearchParams(window.location. search);
    params.delete(type === 'query' ? 'q' : type);
    window.location.search = params.toString();
}

// 검색 버튼 이벤트
document.addEventListener('DOMContentLoaded', async function() {
    // 데이터 로드
    await loadData();
    
    // URL 파라미터 읽기
    const params = getQueryParams();
    
    // 검색 실행
    const results = performSearch(params.query, params.tag, params.type);
    
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
        const query = searchInput.value.trim();
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