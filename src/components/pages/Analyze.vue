<template>
<div class="container">
    <div class="form">
        <textarea v-model="text"></textarea>
        <button @click="analyzeWrapper">Анализ</button>
    </div>

    <hr>

    <p>Обычных слов в базе: {{ common_words.length }}</p>
    <div v-if="show_statistics">
        <p>Всего слов: {{ words.length }}</p>
        <p>Уникальных слов: {{ unique_words.length }}</p>
        <p v-if="words">Уникальность: {{ (unique_words.length / words.length * 100) }}%</p>
    </div>

    <hr>

    <h3>Новые обычные слова ({{ new_common_words.length }})</h3>
    <ul>
        <li v-for="(word, key) in new_common_words">
            <span :key="key" @click="setUnique(key)">{{word}}</span>
        </li>
    </ul>
    <button class="btn" v-show="changed" @click="save">Save</button>

    <hr>

    <h3>Уникальные слова ({{ unique_words.length }})</h3>
    <ul>
        <li v-for="(word, key) in unique_words">
            <span :key="key" @click="setCommon(key)">{{word}}</span>
        </li>
    </ul>

    <div class="loading" v-if="loading">
        <div class="box">
            <h2>{{ loading_message }}</h2>
        </div>
    </div>

</div>
</template>


<script>
const $ = require('jquery')
const os = require("os");
// import jquery from 'jquery';
export default {
    data() {
        return {
            text: "",
            words: [],
            common_words: [],
            new_common_words: [],
            unique_words: [],
            // show_common: false,
            show_unique: false,
            show_statistics: false,
            changed: false,
            loading: false,
            loading_message: ''
        }
    },
    methods: {
        analyzeWrapper() {
            var that = this;

            that.loading = true
            that.loading_message = 'Провожу анализ текста'

            setTimeout(function(){
                that.analyze()
            }, 50);
        },
        analyze() {
            var that = this;

            this.unique_words = []
            this.words = this.text.split((/[\s\n\-]+/));
            this.words.forEach(function(word, index) {
                if (word == "") {
                    return;
                }
                word = word.toLowerCase();
                word = word.replace('«', '');
                word = word.replace('»', '');
                word = word.replace('"', '');
                word = word.replace(',', '');
                word = word.replace("...", '');
                word = word.replace("..", '');
                word = word.replace('.', '');
                word = word.replace('ё', 'е');
                word = word.replace('"', '');
                word = word.replace("'", '');
                word = word.replace("(", '');
                word = word.replace(")", '');
                word = word.replace("!", '');
                word = word.replace("?", '');
                word = word.replace("?!", '');
                word = word.replace(":", '');
                word = word.replace("…", '');
                word = word.replace('\n', '');

                // Прогоняем цикл обычных слов, чтобы проверить, является ли слово обычным
                var isCommon = false;
                if ( that.common_words != undefined ) {
                    that.common_words.forEach(function(common_word) {
                        if (common_word.trim() == word.trim()) {
                            isCommon = true;
                        }
                    });
                }

                // Прогоняем цикл уникальных слов, чтобы проверить, не попалось ли уникальное слово несколько раз
                that.unique_words.forEach(function(unique_word) {
                    if (unique_word.trim() == word.trim()) {
                        isCommon = true;
                    }
                });

                // После всех проверок слово попадает в массив уникальных слов
                if (!isCommon) {
                    that.unique_words.push(word);
                }
            });

            that.show_unique = true
            that.show_statistics = true

            that.loading = false

            // console.log("unique_words:", this.unique_words);
            // console.log("Всего слов: ", this.words.length);
            // console.log("Уникальных слов: ", this.unique_words.length);
            // console.log("Оригинальность: ", (this.unique_words.length / this.words.length * 100), "%");
        },
        load_common_words() {
            var that = this;
            that.loading = true
            that.loading_message = 'Загружаю список слов'
            $.ajax({
                url: '/app/db.php',
                data: {
                    action: 'load_common_words'
                },
                method: 'get',
                success: function(data) {
                    that.common_words = (data != 'null') ? JSON.parse(data) : []
                    that.loading = false
                }
            });
        },
        setCommon(key) {
            let word = this.unique_words[key]
            this.new_common_words.push(word)
            this.unique_words.splice(key, 1)
            this.changed = true
        },
        setUnique(key) {
            let word = this.new_common_words[key]
            this.unique_words.push(word)
            this.new_common_words.splice(key, 1)
            this.changed = true
        },
        save() {
            var that = this;
            that.loading = true
            that.loading_message = `Добавляю в базу новые слова (${that.new_common_words.length})`
            $.ajax({
                url: '/app/db.php',
                method: 'post',
                data: {
                    action: 'save',
                    words: JSON.stringify(that.new_common_words)
                },
                success: function(res) {
                    // console.log('saved')
                    that.changed = false
                    that.new_common_words = []
                    that.refresh()
                }
            });
        },
        refresh() {
            this.load_common_words()
        }
    },
    created() {
        this.load_common_words();
    }
}
</script>


<style scoped>
.container {}
</style>
