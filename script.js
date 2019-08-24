function analyze() {
    var text = document.getElementById('text').value;
    var common_words = [];
    var unique_words = [];

    // Загрузка обычных слов
    
    var files = [ 
        "предлоги",
        "союзы",
        "знаки",
        "местоимения",
        "наречия",
        "глаголы",
    ];
    
    var xhr = new XMLHttpRequest();
    
    files.forEach(function(file){
        xhr.open('GET', "/data/"+file, false);
        xhr.send();
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            new_common_words = xhr.responseText.split('\n');
            new_common_words.forEach(function(word){
                common_words.push(word);
            })
        }
        xhr.abort();
    })
    console.log( "common_words:", common_words);
    
    // Подготовка текста, разбиение его на элементы массива
//    var text_array = text.split(' ');
    var text_array = text.split((/[\s\n]+/));
    text_array.forEach(function(word, index){
        if ( word == "") {
            return;
        }
        word = word.toLowerCase();
        word = word.replace(',', '');
        word = word.replace('.', '');
        word = word.replace('ё', 'е');
        word = word.replace('"', '');
        word = word.replace("'", '');
        word = word.replace("(", '');
        word = word.replace(")", '');
        word = word.replace('\n', '');
        
        // Сравниваем слово со списком обычных слов
        isCommon = false;
        common_words.forEach(function(common_word){
//            console.log(word, "СРАВНИВАЕТСЯ С", common_word );
            if ( common_word.trim() == word.trim() ) {
//                console.log( "common" );
                isCommon = true;
            }
//            console.log('');
        });
            
//        console.log(word, isCommon );
            
        if ( !isCommon ) {
            unique_words.push(word);
        }
    });
    
    console.log( "unique_words:", unique_words);
    console.log( "Всего слов: ", text_array.length );
    console.log( "Уникальных слов: ", unique_words.length );
    console.log( "Оригинальность: ", (unique_words.length / text_array.length * 100), "%" );
}