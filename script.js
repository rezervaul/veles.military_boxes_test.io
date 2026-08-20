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

        // Нас интересуют строки Markdown-таблицы
        if (!line.includes("|")) {
            continue;
        }

        let cells = line
            .split("|")
            .map(cell => {
                return cell
                    .trim()
                    .replace(/\*\*/g, "");
            });

        // Убираем пустые элементы в начале и конце
        if (cells[0] === "") {
            cells.shift();
        }

        if (cells[cells.length - 1] === "") {
            cells.pop();
        }


        // ----------------------------------------
        // Пропускаем строку заголовка
        // ----------------------------------------

        if (
            cells.length === 6 &&
            cells[0].toLowerCase() === "категорія"
        ) {
            continue;
        }


        // ----------------------------------------
        // Пропускаем строку Markdown-разделителя
        // ----------------------------------------

        if (
            cells.length === 6 &&
            cells.every(cell => {
                return /^:?-+:?$/.test(cell);
            })
        ) {
            continue;
        }


        // ----------------------------------------
        // Проверяем количество колонок
        // ----------------------------------------

        if (cells.length !== 6) {
            continue;
        }


        // ----------------------------------------
        // Получаем значения
        // ----------------------------------------

        const category = cells[0];
        const subCategory = cells[1];
        const ingredient = cells[2];
        const minCount = cells[3];
        const maxCount = cells[4];
        const chance = cells[5];


        // ----------------------------------------
        // Проверяем обязательные поля
        // ----------------------------------------

        if (
            !category ||
            !subCategory ||
            !ingredient ||
            !minCount ||
            !maxCount
        ) {
            continue;
        }


        // ----------------------------------------
        // Добавляем строку
        // ----------------------------------------

        rows.push([
            category,
            subCategory,
            ingredient,
            minCount,
            maxCount,
            chance
        ]);
    }


    // ----------------------------------------
    // Если ничего не нашли
    // ----------------------------------------

    if (rows.length === 0) {
        alert("Не вдалося знайти дані таблиці.");
        return;
    }


    // ----------------------------------------
    // Добавляем данные в leftTable
    // ----------------------------------------

    rows.forEach(row => {

        const tr = document.createElement("tr");

        row.forEach(value => {

            const td = document.createElement("td");

            td.textContent = value;

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });


    // Очищаем textarea после загрузки
    inputText.value = "";
});


// ================================
// ОЧИСТИТЬ ТАБЛИЦУ
// ================================

clearTableButton.addEventListener("click", () => {

    const tbody = leftTable.querySelector("tbody");

    tbody.innerHTML = "";

});
