const inputText = document.getElementById("inputText");

const loadButton = document.getElementById("loadButton");
const clearTableButton = document.getElementById("clearTable");

const leftTable = document.getElementById("leftTable");


// ============================================
// УДАЛЕНИЕ MARKDOWN-ФОРМАТИРОВАНИЯ
// ============================================

function cleanCell(value) {
    return value
        .trim()
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .trim();
}


// ============================================
// ПРОВЕРКА: ЯВЛЯЕТСЯ ЛИ СТРОКА РАЗДЕЛИТЕЛЕМ
// ============================================

function isSeparatorRow(cells) {
    if (cells.length !== 6) {
        return false;
    }

    return cells.every(cell => {
        const value = cell.trim();

        // Например:
        // :-----------:
        // :------------:
        // -------------
        return /^:*-+:*$/.test(value);
    });
}


// ============================================
// ЗАГРУЗКА ТАБЛИЦЫ
// ============================================

loadButton.addEventListener("click", () => {

    const text = inputText.value;

    if (!text.trim()) {
        alert("Спочатку вставте таблицю.");
        return;
    }


    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== "");


    const rows = [];


    // ========================================
    // ОБРАБОТКА КАЖДОЙ СТРОКИ
    // ========================================

    for (const line of lines) {

        // Нам нужны только строки с |
        if (!line.includes("|")) {
            continue;
        }


        // ------------------------------------
        // Разделяем строку на колонки
        // ------------------------------------

        let cells = line.split("|");


        // Если строка начинается с |
        if (cells[0].trim() === "") {
            cells.shift();
        }


        // Если строка заканчивается |
        if (cells.length > 0 && cells[cells.length - 1].trim() === "") {
            cells.pop();
        }


        // Очищаем каждую ячейку
        cells = cells.map(cleanCell);


        // ------------------------------------
        // Нам нужны ровно 6 колонок
        // ------------------------------------

        if (cells.length !== 6) {
            console.log("Пропущена строка:", line);
            console.log("Найдено колонок:", cells.length);
            continue;
        }


        // ------------------------------------
        // Пропускаем разделитель
        // ------------------------------------

        if (isSeparatorRow(cells)) {
            continue;
        }


        // ------------------------------------
        // Пропускаем заголовок
        // ------------------------------------

        const firstCell = cells[0].toLowerCase();

        if (firstCell === "категорія") {
            continue;
        }


        // ------------------------------------
        // Получаем данные
        // ------------------------------------

        const category = cells[0];
        const subCategory = cells[1];
        const ingredient = cells[2];
        const minCount = cells[3];
        const maxCount = cells[4];
        const chance = cells[5];


        // ------------------------------------
        // Проверяем обязательные поля
        // ------------------------------------

        if (
            category === "" ||
            subCategory === "" ||
            ingredient === "" ||
            minCount === "" ||
            maxCount === ""
        ) {
            continue;
        }


        // ------------------------------------
        // Добавляем строку
        // ------------------------------------

        rows.push([
            category,
            subCategory,
            ingredient,
            minCount,
            maxCount,
            chance
        ]);
    }


    // ========================================
    // ПРОВЕРКА РЕЗУЛЬТАТА
    // ========================================

    if (rows.length === 0) {

        alert(
            "Не вдалося знайти дані таблиці.\n\n" +
            "Перевірте формат вставленої таблиці."
        );

        return;
    }


    // ========================================
    // ДОБАВЛЯЕМ В LEFT TABLE
    // ========================================

    const tbody = leftTable.querySelector("tbody");


    rows.forEach(row => {

        const tr = document.createElement("tr");


        row.forEach(value => {

            const td = document.createElement("td");

            td.textContent = value;

            tr.appendChild(td);
        });


        tbody.appendChild(tr);
    });


    // ========================================
    // ОЧИЩАЕМ TEXTAREA
    // ========================================

    inputText.value = "";

});


// ============================================
// ОЧИСТИТЬ ТАБЛИЦУ
// ============================================

clearTableButton.addEventListener("click", () => {

    const tbody = leftTable.querySelector("tbody");

    tbody.innerHTML = "";

});
