// URL에서 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const regionId = parseInt(urlParams.get('id'));

console.log('Region ID:', regionId);

// JSON 데이터 로드 (경로 수정!)
fetch('../data/tea_regions.json')  // ✅ ../data로 수정
    .then(response => response. json())
    .then(regions => {
        const region = regions.find(r => r.id === regionId);
        
        if (region) {
            displayRegionDetail(region);
            initDetailMap(region);
        } else {
            showError();
        }
    })
    .catch(error => {
        console.error('데이터 로드 실패:', error);
        showError();
    });

// 산지 상세 정보 표시
function displayRegionDetail(region) {
    // 로딩 숨기기
    document.getElementById('loading').style.display = 'none';
    document.getElementById('region-detail').style.display = 'block';
    document.getElementById('detail-map').style.display = 'block';
    
    // 페이지 제목 변경
    document.getElementById('page-title').textContent = region.name_en;
    document.getElementById('page-subtitle').textContent = `${region.name_ko} - ${region.country}`;
    document.getElementById('breadcrumb-current').textContent = region.name_ko;
    document.title = `The Tea Atelier | ${region.name_ko}`;
    
    // 상세 정보 HTML 생성
    document.getElementById('region-detail').innerHTML = `
        <div class="featured-hero">
            <img src="${region.image_hero_url}" 
                alt="${region.name_ko}"
                onerror="this.src='${region.image_url}'">
        </div>
        
        <div class="region-detail-intro">
            <h2>${region.name_en} <small style="font-size: 0.7em; color: #666;">(${region.name_ko})</small></h2>
            <div class="region-meta">
                <span class="meta-item">${region.country_flag} ${region.country}</span>
                <span class="meta-item">🍵 ${region.tea_type}</span>
                <span class="meta-item">📍 ${region.altitude}</span>
                <span class="meta-item">🌤️ ${region.climate}</span>
            </div>
        </div>
        
        <div class="region-detail-content">
            <h3>산지 특징</h3>
            <p>${region.description}</p>
            
            <h3>떼루아 특성</h3>
            <div class="terroir-tags">
                ${region.terroir_characteristics.split(', ')
                    .map(tag => `<span class="tag">${tag}</span>`)
                    .join('')}
            </div>
            
            <h3>대표 차</h3>
            <p>${region.famous_teas}</p>
            
            <h3>수확 시기</h3>
            <p>${region.harvest_season}</p>
            
            <h3>산지 위치</h3>
            <p>위도: ${region.latitude}°, 경도: ${region.longitude}°</p>
        </div>
    `;
}

// Google Maps 표시
function initDetailMap(region) {
    const position = {
        lat: parseFloat(region.latitude),
        lng: parseFloat(region.longitude)
    };
    
    const map = new google.maps. Map(document.getElementById('detail-map'), {
        zoom: 10,
        center: position,
        mapTypeId: 'hybrid',
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps. ControlPosition.TOP_RIGHT,
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
        },
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: region.name_ko,
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: '#AA3624',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 4
        }
    });
    
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 15px; font-family: 'Noto Sans KR', sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #AA3624; font-family: 'GFS Didot', serif; font-size: 18px;">
                    ${region. name_en}
                </h3>
                <p style="margin: 3px 0; font-size: 14px; color: #555;">
                    ${region.country_flag} ${region.country}
                </p>
                <p style="margin: 3px 0; font-size:  13px; color: #4F7B60; font-weight: 600;">
                    ${region.tea_type}
                </p>
                <p style="margin: 3px 0; font-size: 12px; color: #888;">
                    📍 ${region.altitude}
                </p>
            </div>
        `
    });
    
    infoWindow.open(map, marker);
    
    marker.addListener('click', () => {
        if (infoWindow.getMap()) {
            infoWindow. close();
        } else {
            infoWindow.open(map, marker);
        }
    });
}

// 오류 표시
function showError() {
    document.getElementById('loading').innerHTML = 
        '<p style="color: red;">산지 정보를 찾을 수 없습니다. </p>';
    document.getElementById('region-detail').style.display = 'none';
    document.getElementById('detail-map').style.display = 'none';
}