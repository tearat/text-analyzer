<?php

function connect()
{
    $host = 'localhost';
    $user = 'root';
    $password = '';
    $db_name = 'textanal';

    $mysql = mysqli_connect($host, $user, $password, $db_name) or die('Database connection error');
    mysqli_set_charset($mysql, 'utf8');

    return $mysql;
}

if( $_GET['action'] == 'load_common_words' )
{
    $mysql = connect();

    $sql = 'SELECT word from `common_words` ORDER BY word';
    $result = mysqli_query($mysql, $sql);
    while ($row = mysqli_fetch_assoc($result))
    {
        $data[] = $row['word'];
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}

if( $_POST['action'] == 'save' )
{
    $mysql = connect();

    // $sql = 'DELETE from `common_words`';
    // $result = mysqli_query($mysql, $sql);

    $words = json_decode($_POST['words']);
    foreach ($words as $word) {
        // $sql = "INSERT INTO `common_words` (word) VALUES ('$word');";
        $sql = "INSERT INTO `common_words` (word) SELECT ('$word') WHERE NOT EXISTS (SELECT * FROM `common_words` WHERE word = '$word');";
        $result = mysqli_query($mysql, $sql);
    }
    echo "yes";
}

?>
