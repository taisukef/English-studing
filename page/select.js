import { CSV } from "https://code4fukui.github.io/CSV/CSV.js";

const sentences = await CSV.fetchJSON("../data/sentences.csv");

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

displaySentence();
document.getElementById("button-check").onclick = () => checkSentence();
