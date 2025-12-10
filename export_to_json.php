<? php
require_once 'includes/db_config.php';

try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT * FROM tea_regions ORDER BY id ASC");
    $regions = $stmt->fetchAll(PDO:: FETCH_ASSOC);
    
    // data 폴더 생성 (없으면)
    if (!file_exists('data')) {
        mkdir('data', 0777, true);
    }
    
    // JSON 파일로 저장
    $json = json_encode($regions, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    file_put_contents('data/tea_regions.json', $json);
    
    echo "✅ JSON 파일 생성 완료! <br>";
    echo "파일 위치: data/tea_regions.json<br>";
    echo "데이터 개수: " . count($regions) . "개<br><br>";
    
    echo "<h3>생성된 데이터:</h3>";
    echo "<pre>" . $json . "</pre>";
    
} catch(Exception $e) {
    echo "❌ 오류:  " . $e->getMessage();
}
?>