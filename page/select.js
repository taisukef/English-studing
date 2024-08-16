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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function selectRandomSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
}

function processSentence(sentence) {
    return sentence.split(" ").map(word => {
        // ピリオドやカンマを分離し、小文字に変換。ただし 'I' は変換しない
        if (word === "I") {
            return word;
        }
        const lowerCased = word.toLowerCase();
        return lowerCased.replace(/([.,:!?])/g, " $1").trim();
    }).join(" ").split(" ");
}

function displaySentence() {
    const sentence = selectRandomSentence();
    const japaneseElement = document.getElementById("japanese-sentence");
    const wordContainer = document.getElementById("word-container");

    japaneseElement.textContent = sentence.japanese;
    const words = processSentence(sentence.english);
    shuffleArray(words);

    wordContainer.innerHTML = "";
    words.forEach(word => {
        const wordElement = document.createElement("span");
        wordElement.textContent = word;
        wordElement.classList.add("word-box");
        wordElement.addEventListener("click", () => selectWord(wordElement));
        wordContainer.appendChild(wordElement);
    });

    document.getElementById("selected-words").innerHTML = "";
    document.getElementById("result").textContent = "";
}

function selectWord(element) {
    const selectedWordsContainer = document.getElementById("selected-words");
    const wordContainer = document.getElementById("word-container");

    if (element.parentElement.isSameNode(wordContainer)) {
        selectedWordsContainer.appendChild(element);
    } else {
        wordContainer.appendChild(element);
    }
}

let mistakeCount = 0;
let isLocked = false; // 正解が表示されている間はボタンが次の問題を表示する

function checkSentence() {
    const selectedWordsContainer = document.getElementById("selected-words");
    const selectedWords = Array.from(selectedWordsContainer.getElementsByClassName("word-box")).map(word => word.textContent);
    const originalSentence = sentences.find(s => s.japanese === document.getElementById("japanese-sentence").textContent).english;

    const processedOriginal = processSentence(originalSentence).join(" ");
    const resultElement = document.getElementById("result");

    if (isLocked) {
        // ロック状態なら次の問題を表示する
        isLocked = false;
        displaySentence();
        return;
    }

    if (selectedWords.join(" ") === processedOriginal) {
        resultElement.textContent = "正解！！　ボタンを押して次の問題へ";
        resultElement.style.color = "green";
        mistakeCount = 0; // ミスカウントをリセット
        isLocked = true; // 次の問題を表示する前にロックする
    } else {
        mistakeCount++;
        if (mistakeCount >= 3) {
            resultElement.textContent = `残念　正解は "${processedOriginal}". ボタンを押して次の問題へ`;
            resultElement.style.color = "blue";
            mistakeCount = 0; // ミスカウントをリセット
            isLocked = true; // ロックする
        } else {
            resultElement.textContent = `Try Again! (${mistakeCount}/3)`;
            resultElement.style.color = "red";
        }
    }
}

window.onload = function() {
    displaySentence();
    document.getElementById("button-check").onclick = () => checkSentence();
};

