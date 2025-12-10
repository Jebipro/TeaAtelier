<?php
require_once 'includes/db_config.php';

echo "<h1>데이터베이스 연결 테스트</h1>";

try {
    $pdo = getDBConnection();
    echo "<p style='color: green;'>✅ 데이터베이스 연결 성공!</p>";
    
    // 데이터 조회 테스트
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM tea_regions");
    $result = $stmt->fetch();
    
    echo "<p>산지 데이터 개수: <strong>" . $result['count'] . "개</strong></p>";
    
    // 전체 데이터 표시
    $stmt = $pdo->query("SELECT id, name_ko, country, tea_type FROM tea_regions");
    $regions = $stmt->fetchAll();
    
    echo "<h2>등록된 산지 목록: </h2>";
    echo "<ul>";
    foreach($regions as $region) {
        echo "<li>#{$region['id']} - {$region['name_ko']} ({$region['country']}) - {$region['tea_type']}</li>";
    }
    echo "</ul>";
    
} catch(Exception $e) {
    echo "<p style='color: red;'>❌ 오류: " . $e->getMessage() . "</p>";
}
?>