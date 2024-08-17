import { CSV } from "https://code4fukui.github.io/CSV/CSV.js";

const url = location.hash.substring(1) || "../data/sentences.csv";
const sentences = await CSV.fetchJSON(url);

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

document.getElementById("button-check").onclick = () => checkTranslation();
document.getElementById("button-next").onclick = () => restartExercise();
