const inputText = document.getElementById("inputText");

const loadButton = document.getElementById("loadButton");
const clearTableButton = document.getElementById("clearTable");

const leftTable = document.getElementById("leftTable");


// ================================
// ЗАГРУЗКА ТАБЛИЦЫ
// ================================

loadButton.addEventListener("click", () => {

    const text = inputText.value.trim();

    if (!text) {
        alert("Спочатку вставте таблицю.");
        return;
    }

    const lines = text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

    const rows = [];

    for (const line of lines) {

        // Пропускаем разделитель Markdown:
        // | :--- | :--- |
        if (/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line)) {
            continue;
        }

        // Разбираем строку по |
        let cells = line
            .split("|")
            .map(cell => cell.trim());

        // Убираем пустые элементы по краям
        if (cells[0] === "") {
            cells.shift();
        }

        if (cells[cells.length - 1] === "") {
            cells.pop();
        }

        // Нам нужны ровно 6 колонок
        if (cells.length === 6) {
            rows.push(cells);
        }
    }


    // Если ничего не нашли
    if (rows.length === 0) {
        alert("Не вдалося знайти дані таблиці.");
        return;
    }


    const tbody = leftTable.querySelector("tbody");

    // Добавляем найденные строки
    rows.forEach(row => {

        const tr = document.createElement("tr");

        row.forEach(cell => {

            const td = document.createElement("td");

            td.textContent = cell;

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });


    // После загрузки очищаем textarea
    inputText.value = "";
});


// ================================
// ОЧИСТИТЬ ТАБЛИЦУ
// ================================

clearTableButton.addEventListener("click", () => {

    const tbody = leftTable.querySelector("tbody");

    tbody.innerHTML = "";

});
