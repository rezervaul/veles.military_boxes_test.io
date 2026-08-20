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

    const tbody = leftTable.querySelector("tbody");

    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const rows = [];

    for (const line of lines) {

        // ==========================================
        // 1. Markdown-таблица с символами |
        // ==========================================

        if (line.includes("|")) {

            let cells = line
                .split("|")
                .map(cell => cell.trim());

            // Убираем пустые ячейки по краям
            if (cells[0] === "") {
                cells.shift();
            }

            if (cells[cells.length - 1] === "") {
                cells.pop();
            }

            // Пропускаем строку-разделитель Markdown
            if (
                cells.length === 6 &&
                cells.every(cell => /^:?-+:?$/.test(cell))
            ) {
                continue;
            }

            // Пропускаем заголовок
            if (
                cells.length === 6 &&
                cells[0].toLowerCase() === "категорія"
            ) {
                continue;
            }

            if (cells.length === 6) {
                rows.push(cells);
            }

            continue;
        }


        // ==========================================
        // 2. Таблица без | 
        //    Например после копирования из браузера
        // ==========================================

        // Пропускаем заголовок
        if (
            line.toLowerCase().includes("категорія") &&
            line.toLowerCase().includes("інгредієнт")
        ) {
            continue;
        }


        // Ищем последние 3 значения:
        // Мин к-сть
        // Макс к-сть
        // Шанс

        const match = line.match(
            /^(.*?)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?%)\s*$/
        );

        if (!match) {
            continue;
        }

        const textPart = match[1].trim();

        const min = match[2];
        const max = match[3];
        const chance = match[4];


        // ==========================================
        // Определяем категорию / подкатегорию /
        // ингредиент
        // ==========================================

        const knownSubCategories = [
            "Common",
            "Uncommon",
            "Rare",
            "Epic",
            "Legendary"
        ];

        let category = "";
        let subCategory = "";
        let ingredient = "";


        // Ищем известную подкатегорию
        let foundSubCategory = null;

        for (const sub of knownSubCategories) {
            const regex = new RegExp(
                `\\s+${sub}\\s+`,
                "i"
            );

            if (regex.test(textPart)) {
                foundSubCategory = sub;
                break;
            }
        }


        if (foundSubCategory) {

            const parts = textPart.split(
                new RegExp(`\\s+${foundSubCategory}\\s+`, "i")
            );

            category = parts[0].trim();
            subCategory = foundSubCategory;
            ingredient = parts.slice(1).join(" ").trim();

        } else {

            // Если подкатегория неизвестна,
            // пробуем разделить по табуляции

            const parts = textPart
                .split(/\t+/)
                .map(value => value.trim())
                .filter(Boolean);

            if (parts.length >= 3) {

                category = parts[0];
                subCategory = parts[1];
                ingredient = parts.slice(2).join(" ");

            } else {

                // Последний запасной вариант:
                // первые два слова = категория/подкатегория,
                // остальное = ингредиент

                const words = textPart.split(/\s+/);

                if (words.length >= 3) {
                    category = words[0];
                    subCategory = words[1];
                    ingredient = words.slice(2).join(" ");
                }
            }
        }


        if (category && subCategory && ingredient) {

            rows.push([
                category,
                subCategory,
                ingredient,
                min,
                max,
                chance
            ]);
        }
    }


    // ==========================================
    // Проверяем результат
    // ==========================================

    if (rows.length === 0) {
        alert(
            "Не вдалося знайти дані таблиці.\n\n" +
            "Переконайтеся, що таблиця має 6 колонок."
        );

        return;
    }


    // ==========================================
    // Добавляем строки в leftTable
    // ==========================================

    rows.forEach(row => {

        const tr = document.createElement("tr");

        row.forEach(value => {

            const td = document.createElement("td");

            td.textContent = value;

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });


    // Очищаем textarea
    inputText.value = "";
});


// ================================
// ОЧИСТИТЬ ТАБЛИЦУ
// ================================

clearTableButton.addEventListener("click", () => {

    const tbody = leftTable.querySelector("tbody");

    tbody.innerHTML = "";

});
