const inputText = document.getElementById("inputText");
const loadButton = document.getElementById("loadButton");
const clearTableButton = document.getElementById("clearTable");
const leftTable = document.getElementById("leftTable");


// ============================================
// Очистка содержимого ячейки
// ============================================

function cleanCell(value) {
    return value
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .trim();
}


// ============================================
// Разбор строки Markdown-таблицы
// ============================================

function parseTableLine(line) {

    // Убираем пробелы по краям
    line = line.trim();

    // Строка должна содержать |
    if (!line.includes("|")) {
        return null;
    }

    // Убираем первую и последнюю |
    if (line.startsWith("|")) {
        line = line.substring(1);
    }

    if (line.endsWith("|")) {
        line = line.substring(0, line.length - 1);
    }

    // Разделяем на колонки
    const cells = line
        .split("|")
        .map(cleanCell);

    return cells;
}


// ============================================
// Проверка строки-разделителя
// ============================================

function isSeparatorRow(cells) {

    if (!cells || cells.length !== 6) {
        return false;
    }

    return cells.every(cell => {
        return /^:?-+:?$/.test(cell);
    });
}


// ============================================
// Проверка заголовка
// ============================================

function isHeaderRow(cells) {

    if (!cells || cells.length !== 6) {
        return false;
    }

    return (
        cells[0].toLowerCase() === "категорія" &&
        cells[1].toLowerCase() === "суб категорія" &&
        cells[2].toLowerCase() === "інгредієнт" &&
        cells[3].toLowerCase() === "мін к-сть" &&
        cells[4].toLowerCase() === "макс к-сть" &&
        cells[5].toLowerCase() === "шанс"
    );
}


// ============================================
// ЗАГРУЗКА
// ============================================

loadButton.addEventListener("click", () => {

    const text = inputText.value;

    if (!text.trim()) {
        alert("Спочатку вставте таблицю.");
        return;
    }


    // Разбиваем текст на строки
    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== "");


    let headerFound = false;
    const rows = [];


    // ========================================
    // Обрабатываем строки
    // ========================================

    for (const line of lines) {

        const cells = parseTableLine(line);

        // Это не строка таблицы
        if (!cells) {
            continue;
        }


        // ====================================
        // Ищем заголовок
        // ====================================

        if (!headerFound) {

            if (isHeaderRow(cells)) {
                headerFound = true;
            }

            // Всё до заголовка игнорируем
            continue;
        }


        // ====================================
        // Пропускаем разделитель
        // ====================================

        if (isSeparatorRow(cells)) {
            continue;
        }


        // ====================================
        // Нам нужно ровно 6 колонок
        // ====================================

        if (cells.length !== 6) {
            console.warn(
                "Пропущена строка:",
                line,
                "Колонок:",
                cells.length
            );

            continue;
        }


        // ====================================
        // Получаем значения
        // ====================================

        const category = cells[0];
        const subCategory = cells[1];
        const ingredient = cells[2];
        const minCount = cells[3];
        const maxCount = cells[4];
        const chance = cells[5];


        // ====================================
        // Проверяем обязательные поля
        //
        // chance НЕ проверяем, потому что
        // он может быть пустым
        // ====================================

        if (
            !category ||
            !subCategory ||
            !ingredient ||
            !minCount ||
            !maxCount
        ) {
            console.warn(
                "Пропущена неполная строка:",
                cells
            );

            continue;
        }


        // ====================================
        // Добавляем строку
        // ====================================

        rows.push({
            category,
            subCategory,
            ingredient,
            minCount,
            maxCount,
            chance
        });
    }


    // ========================================
    // Проверяем наличие заголовка
    // ========================================

    if (!headerFound) {

        alert(
            "Не вдалося знайти заголовок таблиці.\n\n" +
            "Потрібні колонки:\n\n" +
            "Категорія | Суб категорія | Інгредієнт | Мін к-сть | Макс к-сть | Шанс"
        );

        return;
    }


    // ========================================
    // Проверяем наличие строк
    // ========================================

    if (rows.length === 0) {

        alert(
            "Заголовок таблиці знайдено,\n" +
            "але даних після нього немає."
        );

        return;
    }


    // ========================================
    // Добавляем строки в leftTable
    // ========================================

    const tbody = leftTable.querySelector("tbody");


    rows.forEach(row => {

        const tr = document.createElement("tr");


        // Категория
        const categoryCell = document.createElement("td");
        categoryCell.textContent = row.category;
        tr.appendChild(categoryCell);


        // Суб категория
        const subCategoryCell = document.createElement("td");
        subCategoryCell.textContent = row.subCategory;
        tr.appendChild(subCategoryCell);


        // Ингредиент
        const ingredientCell = document.createElement("td");
        ingredientCell.textContent = row.ingredient;
        tr.appendChild(ingredientCell);


        // Минимальное количество
        const minCell = document.createElement("td");
        minCell.textContent = row.minCount;
        tr.appendChild(minCell);


        // Максимальное количество
        const maxCell = document.createElement("td");
        maxCell.textContent = row.maxCount;
        tr.appendChild(maxCell);


        // Шанс
        const chanceCell = document.createElement("td");
        chanceCell.textContent = row.chance;
        tr.appendChild(chanceCell);


        tbody.appendChild(tr);
    });


    // ========================================
    // Очищаем textarea
    // ========================================

    inputText.value = "";


    console.log(
        `Завантажено рядків: ${rows.length}`
    );
});


// ============================================
// ОЧИСТИТИ ТАБЛИЦЮ
// ============================================

clearTableButton.addEventListener("click", () => {

    const tbody = leftTable.querySelector("tbody");

    tbody.innerHTML = "";
});
