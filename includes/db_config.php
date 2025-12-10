<? php
// HeidiSQL로 설정한 MariaDB 연결 정보
define('DB_HOST', '127.0.0.1');  // 또는 'localhost'
define('DB_NAME', 'tea_atelier');
define('DB_USER', 'root');
define('DB_PASS', 'a1234'); // HeidiSQL에서 설정한 비밀번호 입력

// PDO 연결 함수
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME .  ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO:: ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
        
    } catch(PDOException $e) {
        // 개발 중에는 에러 표시, 배포 시에는 로그로 기록
        die("데이터베이스 연결 실패: " . $e->getMessage());
    }
}
?>