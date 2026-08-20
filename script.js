const inputText = document.getElementById("inputText");

const clearTableButton = document.getElementById("clearTable");
const openButton = document.getElementById("openButton");
const resetButton = document.getElementById("resetButton");

const leftTable = document.getElementById("leftTable");
const centerTable = document.getElementById("centerTable");
const rightTable = document.getElementById("rightTable");


// Очистить левую таблицу
clearTableButton.addEventListener("click", () => {
    const tbody = leftTable.querySelector("tbody");

    tbody.innerHTML = "";
});


// Кнопка "Открыть"
openButton.addEventListener("click", () => {
    console.log("Кнопка Открыть нажата");

    // Здесь позже добавим нужную логику
});


// Кнопка "Сброс"
resetButton.addEventListener("click", () => {
    inputText.value = "";

    centerTable.querySelector("tbody").innerHTML = "";
    rightTable.querySelector("tbody").innerHTML = "";
});
