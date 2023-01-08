<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="images/icon.png">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,800" rel="stylesheet">
    <title>Lista zakupów</title>
    <link rel="stylesheet" href="styles/styles.css">
    <script src="scripts/script.js"></script>
</head>

<body>

    <div class="main">
        <header>
            <h1 class="bold">Lista zakupów</h1>
            <div class="divider"></div>
            <div class="new_item">
                <label class="bold" for="new_input">Nowy:</label>
                <input class="new_input" id="newInput" list="hints" type="text" placeholder="Podaj produkt">
                <button class="right add" id="addbtn">Dodaj</button>
            </div>

            <div class="divider md"></div>
        </header>

        <datalist id="hints"></datalist>
        <p class="bold">Do kupienia</p>
        <div id="to_buy">
        </div>

        <div class="divider md"></div>

        <p class="bold done">Kupione</p>
        <div id="bought">
        </div>
    </div>

</body>

</html>