// 例文のリスト
const sentences = [
    { japanese: "今日は晴れです。", english: "It is sunny today." },
    { japanese: "私は猫が好きです。", english: "I like cats." },
    { japanese: "あなたの名前は何ですか？", english: "What is your name?" },
    { japanese: "彼は先生です。", english: "He is a teacher." },
    { japanese: "私は東京に住んでいます。", english: "I live in Tokyo." },
    { japanese: "彼女はピアノを弾きます。", english: "She plays the piano." },
    { japanese: "私たちは友達です。", english: "We are friends." },
    { japanese: "彼らはサッカーをします。", english: "They play soccer." },
    { japanese: "この本は面白いです。", english: "This book is interesting." },
    { japanese: "私は毎日学校に行きます。", english: "I go to school every day." },
    { japanese: "彼はバスで通学します。", english: "He goes to school by bus." },
    { japanese: "今日は日曜日です。", english: "Today is Sunday." },
    { japanese: "私は朝ごはんを食べました。", english: "I ate breakfast." },
    { japanese: "彼女は英語を勉強しています。", english: "She is studying English." },
    { japanese: "私は手紙を書きました。", english: "I wrote a letter." },
    { japanese: "彼は映画を見ています。", english: "He is watching a movie." },
    { japanese: "私はコーヒーを飲みます。", english: "I drink coffee." },
    { japanese: "彼女は毎日走ります。", english: "She runs every day." },
    { japanese: "私は新しい靴を買いました。", english: "I bought new shoes." },
    { japanese: "彼らは音楽を聞いています。", english: "They are listening to music." },
    { japanese: "彼女は将来医者になりたいと言っています。", english: "She says she wants to become a doctor in the future." },
    { japanese: "私は昨日その映画を見て、とても感動しました。", english: "I watched that movie yesterday, and it moved me deeply." },
    { japanese: "彼らはこのプロジェクトを成功させるために一生懸命働いています。", english: "They are working hard to make this project successful." },
    { japanese: "彼は私に、その問題についてどう思うか尋ねました。", english: "He asked me what I thought about the problem." },
    { japanese: "私は旅行が大好きで、毎年新しい場所を訪れます。", english: "I love traveling, and I visit new places every year." },
    { japanese: "彼女はピアノを10年間練習してきました。", english: "She has been practicing the piano for ten years." },
    { japanese: "明日、私たちはこの都市を探索する予定です。", english: "We are planning to explore the city tomorrow." },
    { japanese: "私は新しいスマートフォンを買うかどうか迷っています。", english: "I am wondering whether to buy a new smartphone or not." },
    { japanese: "彼はその試験に合格するために毎日勉強しています。", english: "He studies every day to pass the exam." },
    { japanese: "彼女はフランス語を学ぶためにフランスに行くつもりです。", english: "She is going to France to learn French." }
];

let correctTranslation = '';
let currentSentenceIndex = -1;

// ランダムな例文を表示する関数
function displayRandomSentence() {
    currentSentenceIndex = Math.floor(Math.random() * sentences.length);
    const sentence = sentences[currentSentenceIndex];
    document.getElementById("japanese-sentence").textContent = sentence.japanese;
    correctTranslation = sentence.english;
}

// 英訳をチェックする関数
function checkTranslation() {
    const userTranslation = document.getElementById("user-translation").value.trim();
    const resultElement = document.getElementById("result");

    if (userTranslation.toLowerCase() === correctTranslation.toLowerCase()) {
        resultElement.innerHTML = "<span style='color: #4CAF50;'>正解！素晴らしい！</span>";
        setTimeout(() => {
            displayRandomSentence();
            document.getElementById("user-translation").value = "";
            resultElement.textContent = "";
        }, 1500);
    } else {
        const highlighted = highlightDifferences(userTranslation, correctTranslation);
        resultElement.innerHTML = `<span style='color: #E74C3C;'>不正解</span><br>あなたの答え: ${highlighted}<br>正しい答え: ${correctTranslation}`;
    }
}

// リスタート機能（次の問題を表示）
function restartExercise() {
    displayRandomSentence();
    document.getElementById("user-translation").value = "";
    document.getElementById("result").textContent = "";
}

//間違えた部分をハイライトする関数
function highlightDifferences(userText, correctText) {
    const userWords = userText.toLowerCase().split(/\s+/);
    const correctWords = correctText.toLowerCase().split(/\s+/);

    let result = "";
    let errorBlock = "";
    let correctBlock = "";
    let inError = false;

    for (let i = 0; i < Math.max(userWords.length, correctWords.length); i++) {
        const userWord = userWords[i] || "";
        const correctWord = correctWords[i] || "";

        if (userWord !== correctWord) {
            if (!inError) {
                inError = true;
                if (errorBlock) {
                    result += `<span style="color: #E74C3C; text-decoration: line-through;">${errorBlock.trim()}</span> `;
                    result += `<span style="color: #3498DB; text-decoration: underline;">${correctBlock.trim()}</span> `;
                    errorBlock = "";
                    correctBlock = "";
                }
            }
            errorBlock += `${userWord} `;
            correctBlock += `${correctWord} `;
        } else {
            if (inError) {
                result += `<span style="color: #E74C3C; text-decoration: line-through;">${errorBlock.trim()}</span> `;
                result += `<span style="color: #3498DB; text-decoration: underline;">${correctBlock.trim()}</span> `;
                errorBlock = "";
                correctBlock = "";
                inError = false;
            }
            result += `<span style="color: black;">${correctWord}</span> `;
        }
    }

    if (inError) {
        result += `<span style="color: #E74C3C; text-decoration: line-through;">${errorBlock.trim()}</span> `;
        result += `<span style="color: #3498DB; text-decoration: underline;">${correctBlock.trim()}</span> `;
    }

    return result.trim();
}

// Diffライブラリ
const Diff = {
    diffWords: function (oldStr, newStr) {
        const result = [];
        const oldWords = oldStr.split(' ');
        const newWords = newStr.split(' ');

        let i = 0, j = 0;
        while (i < oldWords.length || j < newWords.length) {
            if (i < oldWords.length && j < newWords.length && oldWords[i] === newWords[j]) {
                result.push({ value: oldWords[i] + ' ' });
                i++;
                j++;
            } else if (j < newWords.length && (i >= oldWords.length || oldWords[i] !== newWords[j])) {
                result.push({ value: newWords[j] + ' ', added: true });
                j++;
            } else if (i < oldWords.length) {
                result.push({ value: oldWords[i] + ' ', removed: true });
                i++;
            }
        }

        return result;
    }
};

// エンターキーでチェックを実行
document.getElementById("user-translation").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkTranslation();
    }
});

// 初期化
displayRandomSentence();