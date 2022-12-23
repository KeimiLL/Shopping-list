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
                <p class="bold">Nowy:</p>
                <input class="new_input" id="new_input" type="text" placeholder="Podaj produkt">
                <button class="right add">Dodaj</button>
            </div>

            <div class="divider md"></div>
        </header>

        <div id="to_buy">
            <p class="bold">Do kupienia</p>
            <div class="divider md"></div>
            <p class="divider">marchew<button class="right">&#10004;</button></p>
            <p class="divider">woda<button class="right">&#10004;</button></p>
            <p class="divider">kukurydza<button class="right">&#10004;</button></p>
            <p class="divider">fasola<button class="right">&#10004;</button></p>
        </div>

        <div id="bought">
            <p class="bold done">Kupione</p>
            <div class="divider md"></div>
            <p class="divider">rabarbar<button class="right">&#8634;</button></p>
            <p class="divider">chipsy<button class="right">&#8634;</button></p>
            <p class="divider">kurczak<button class="right">&#8634;</button></p>
            <p class="divider">śmietana 30%<button class="right">&#8634;</button></p>
        </div>
    </div>

</body>

</html>