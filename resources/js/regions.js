let regionsData = [];
let map;
let markers = [];
const initialCenter = { lat: 25, lng: 100 };  // 초기 중심 좌표
const initialZoom = 3;  // 초기 줌 레벨

// Google Maps 초기화
function initMap() {
    // 세계 지도 중심 (아시아 중심)
    map = new google.maps.Map(document.getElementById('world-map'), {
        zoom: initialZoom,
        center:  initialCenter,
        mapTypeId: 'hybrid',  // ✨ 위성 지도 (hybrid = 위성 + 라벨)
        mapTypeControl: true,  // ✨ 지도 타입 전환 버튼
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position:  google.maps.ControlPosition. TOP_RIGHT,
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
        },
        streetViewControl: false,  // 스트리트뷰 끄기
        fullscreenControl: true,  // 전체화면 버튼
        zoomControl: true,  // 줌 컨트롤
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]  // 관심 지점 라벨 숨기기
            }
        ]
    });
    
    // 초기화 버튼 추가
    addResetButton();
    
    // JSON 데이터 로드
    loadRegions();
}

// 초기화 버튼 추가
function addResetButton() {
    // 버튼 생성
    const resetButton = document.createElement('button');
    resetButton.textContent = '🌍 지도 초기화';
    resetButton.className = 'map-reset-button';
    
    // 버튼 스타일
    resetButton.style.cssText = `
        background-color: #fff;
        border: 2px solid #fff;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        color: #4F7B60;
        cursor: pointer;
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 14px;
        font-weight:  600;
        margin: 10px;
        padding: 12px 20px;
        transition: all 0.3s;
    `;
    
    // 호버 효과
    resetButton.addEventListener('mouseenter', () => {
        resetButton.style.backgroundColor = '#4F7B60';
        resetButton.style.color = '#fff';
        resetButton.style.transform = 'scale(1.05)';
    });
    
    resetButton.addEventListener('mouseleave', () => {
        resetButton.style.backgroundColor = '#fff';
        resetButton.style. color = '#4F7B60';
        resetButton.style. transform = 'scale(1)';
    });
    
    // 클릭 이벤트
    resetButton.addEventListener('click', () => {
        resetMap();
    });
    
    // 지도에 버튼 추가
    map.controls[google.maps. ControlPosition.TOP_CENTER].push(resetButton);
}

// 지도 초기화 함수
function resetMap() {
    // 부드러운 애니메이션으로 초기 위치로 이동
    map.panTo(initialCenter);
    map.setZoom(initialZoom);
    
    // 모든 정보창 닫기
    markers.forEach(marker => {
        if (marker.infoWindow) {
            marker.infoWindow. close();
        }
    });
    
    // 시각적 피드백 (선택사항)
    const resetButton = document.querySelector('.map-reset-button');
    if (resetButton) {
        resetButton.textContent = '✓ 초기화 완료! ';
        setTimeout(() => {
            resetButton. textContent = '🌍 지도 초기화';
        }, 1000);
    }
}

// JSON 파일 로드
function loadRegions() {
    fetch('/data/tea_regions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSON 파일을 찾을 수 없습니다.');
            }
            return response.json();
        })
        .then(regions => {
            regionsData = regions;
            displayRegionCards(regions);
            addMapMarkers(regions);
        })
        .catch(error => {
            console.error('데이터 로드 실패:', error);
            document.getElementById('regions-container').innerHTML = 
                '<p style="text-align: center; color: red;">데이터를 불러올 수 없습니다. </p>';
        });
}

// 산지 카드 표시
function displayRegionCards(regions) {
    const container = document.getElementById('regions-container');
    container.innerHTML = '';
    
    regions.forEach(region => {
        const card = document.createElement('a');
        card.href = `region_detail.html?id=${region.id}`;
        card.className = 'origin-card-link';
        
        card.innerHTML = `
            <div class="origin-card">
                <div class="origin-card-image">
                    <img src="${region.image_url}" 
                         alt="${region.name_ko} 차밭"
                         onerror="this.src='../resources/style/placeholder_tea.jpg'">
                </div>
                <div class="origin-card-content">
                    <h3>${region.name_en}</h3>
                    <p class="region">
                        ${region.country_flag} ${region.country} | ${region.tea_type}
                    </p>
                    <p class="location">
                        📍 ${region.altitude} | ${region.climate}
                    </p>
                    <p class="description">
                        ${region.description. substring(0, 120)}...
                    </p>
                    <div class="terroir-tags">
                        ${region.terroir_characteristics.split(', ')
                            .map(tag => `<span class="tag">${tag}</span>`)
                            .join('')}
                    </div>
                    <span class="read-more">자세히 보기 →</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Google Maps 마커 추가
function addMapMarkers(regions) {
    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    regions. forEach((region, index) => {
        const position = {
            lat: parseFloat(region.latitude),
            lng: parseFloat(region.longitude)
        };
        
        // 마커 생성
        const marker = new google.maps. Marker({
            position: position,
            map: map,
            title: region.name_ko,
            animation: google.maps.Animation.DROP,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4F7B60',
                fillOpacity: 0.95,
                strokeColor: '#ffffff',
                strokeWeight: 3
            }
        });
        
        // 정보 창
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 15px; min-width: 220px; font-family: 'Noto Sans KR', sans-serif;">
                    <h3 style="margin: 0 0 10px 0; color: #AA3624; font-family: 'GFS Didot', serif; font-size: 18px;">
                        ${region. name_en}
                    </h3>
                    <p style="margin: 5px 0; font-size: 14px; color: #555;">
                        ${region.country_flag} ${region.country}
                    </p>
                    <p style="margin: 5px 0; font-size: 13px; color: #4F7B60; font-weight: 600;">
                        ${region.tea_type}
                    </p>
                    <p style="margin: 5px 0; font-size: 12px; color: #888;">
                        📍 ${region.altitude}
                    </p>
                    <a href="region_detail.html?id=${region.id}" 
                        style="display: inline-block; margin-top: 10px; color: #AA3624; text-decoration: none; font-weight: 600; font-size: 13px;">
                        자세히 보기 →
                    </a>
                </div>
            `
        });
        
        // 마커 클릭 이벤트
        marker.addListener('click', () => {
            // 다른 정보창 닫기
            markers.forEach(m => {
                if (m. infoWindow) m.infoWindow.close();
            });
            
            infoWindow.open(map, marker);
            map.panTo(position);
            map.setZoom(6);
        });
        
        marker.infoWindow = infoWindow;
        markers.push(marker);
    });
}

// 페이지 로드 시 (Google Maps API 로드 전이면 대기)
if (typeof google === 'undefined') {
    console.log('Google Maps API 로딩 중...');
} else {
    initMap();
}