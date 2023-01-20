class ShoppingList {
    constructor() {
        this.toBuy = [];
        this.bought = [];
        this.hints = [];
        this.currElem = "";
        this.getListToBuy();
        this.currTimestamp = "";
        this.checkData();
    }

    // pobiera rzeczy do kupienia i umieszcza w tablicy toBuy
    getListToBuy() {
        this.toBuy = [];
        this.bought = [];
        this.hints = [];
        this.currElem = "";

        const xhr = new XMLHttpRequest();

        xhr.open("GET", "./php/getItems.php?list=toBuy");
        // lista toBuy - lista produktow do kupienia
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (this.responseText != null) {
                        const dataXML = this.response;
                        const parser = new DOMParser();
                        const docXML = parser.parseFromString(dataXML, "text/xml");
                        docXML.querySelectorAll("label").forEach(element =>
                            shoppingList.toBuy.push({ label: element.textContent }));
                        shoppingList.getListBought();
                    }
                    else console.log("Błąd: nie otrzymano danych")
                }
                else console.log("Błąd: " + this.statusText)
            }
        }
        // wysyła żądanie na serwer
        xhr.send();
    }

    // pobiera rzeczy kupione i umieszcza w tablicy bought
    getListBought() {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", "./php/getItems.php?list=bought");
        // lista bought - lista produktow kupionych
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (this.responseText != null) {
                        const dataXML = this.response;
                        const parser = new DOMParser();
                        const docXML = parser.parseFromString(dataXML, "text/xml");
                        const time = docXML.querySelectorAll("date");
                        docXML.querySelectorAll("label").forEach((element, idx) => {
                            shoppingList.bought.push({
                                label: element.textContent,
                                date: Date.parse(time[idx].textContent)
                            });
                        });

                        shoppingList.getListHints();
                    }
                    else console.log("Błąd: nie otrzymano danych")
                }
                else console.log("Błąd: " + this.statusText)
            }
        }
        // wysyła żądanie na serwer
        xhr.send();
    }

    // pobiera rzeczy z podpowiedzi i umieszcza na liscie podpowiedzi
    getListHints() {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", "./php/getItems.php?list=hints");
        // lista hints - lista podpowiedzi
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (this.responseText != null) {
                        const dataXML = this.response;
                        const parser = new DOMParser();
                        const docXML = parser.parseFromString(dataXML, "text/xml");
                        docXML.querySelectorAll("label").forEach(element =>
                            shoppingList.hints.push({ label: element.textContent }));
                        shoppingList.showContent();
                    }
                    else console.log("Błąd: nie otrzymano danych")
                }
                else console.log("Błąd: " + this.statusText)
            }
        }
        // wysyła żądanie na serwer
        xhr.send();
    }

    // wyświetla listy który są zapisane
    showContent() {
        this.newInput = document.querySelector('#newInput');
        this.btnAdd = document.querySelector('#addbtn');
        this.toBuyList = document.querySelector('#to_buy');
        this.boughtList = document.querySelector('#bought');
        this.hintsList = document.querySelector('#hints');

        this.newInput.addEventListener('input', (e) => {
            shoppingList.currElem = e.target.value;
        });

        this.btnAdd.addEventListener('click', () => {
            if (shoppingList.currElem.trim().length) {
                shoppingList.createNew();
            }
            else {
                this.newInput.value = "";
                shoppingList.currElem = "";
                shoppingList.removeExpired();
            }

        });

        this.removeExpired();
        this.showListHints();
        this.showListToBuy();
        this.showListBought();
    }

    // odswiezenie widoku listy kupionych rzeczy
    showListToBuy() {
        this.toBuyList.innerHTML = "";
        for (const [idx, toBuy] of this.toBuy.entries()) {
            this.showToBuyInHTML(toBuy, idx);
        }
    }

    // stworzenie nowego elementu do kupienia w htmlu
    showToBuyInHTML(toBuy, idx) {
        const toBuyDiv = document.createElement("div");
        toBuyDiv.className = "toBuyItem";
        toBuyDiv.dataset.id = idx;
        const toBuyLabel = document.createElement("p");
        toBuyLabel.className = "divider";
        toBuyLabel.textContent = toBuy.label;
        const toBuyButton = document.createElement("button");
        toBuyButton.textContent = '\u{2714}';
        toBuyButton.addEventListener("click", () => this.moveToBought(idx));
        toBuyDiv.appendChild(toBuyLabel);
        toBuyDiv.appendChild(toBuyButton);
        this.toBuyList.appendChild(toBuyDiv);
    }

    // przeniesienie elementu do kupionych rzeczy
    moveToBought(idx) {
        this.removeExpired();
        this.toBuy = this.toBuy.filter((t, index) => {
            if (index === idx) {
                this.bought.push({ ...t, date: new Date().toUTCString() });
                return false;
            } else return true;
        });
        const elem = this.bought.slice(-1)[0];
        const index = this.bought.length - 1;

        this.updateData("to_bought", idx, elem);
        this.showListToBuy();
        this.appendBoughtToDom(elem, index);
    }

    // odswiezenie widoku listy podpowiedzi
    showListHints() {
        this.hintsList.innerHTML = "";
        if (this.currElem.length) {
            const foundHints = this.hints.filter((hint) =>
                hint.startsWith(this.currElem)
            );
            foundHints.forEach(hint => this.showHintInHTML(hint));
        } else {
            this.hints.forEach(hint => this.showHintInHTML(hint));
        }
    }

    // stworzenie nowej podpowiedzi w htmlu
    showHintInHTML(hint) {
        const hintOpt = document.createElement("option");
        hintOpt.value = hint.label;
        this.hintsList.appendChild(hintOpt);
    }

    // stworzenie nowego elementu do kupienia
    createNew() {
        this.removeExpired();
        this.toBuy.push({ label: this.currElem.trim() });
        if (this.hints.find((label) => label === this.currElem))
            this.hints.push(this.currElem);
        this.newInput.value = "";
        this.currElem = "";
        const idx = this.toBuy.length - 1;
        this.showToBuyInHTML(...this.toBuy.slice(-1), idx);
        this.showListHints();
        this.sendNewItem(...this.toBuy.slice(-1));
    }

    // wyslanie nowego elementu do kupienia zeby zapisac go do pliku
    sendNewItem(toBuy) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/addToBuy.php");
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    const status = this.status;
                    shoppingList.getListToBuy();
                }
                else console.log("Błąd: " + this.statusText)
            }
        }
        // wysyła żądanie na serwer
        const parser = new DOMParser();
        const docXML = parser.parseFromString(
            `<label>${toBuy.label}</label>`,
            "text/xml"
        );
        xhr.send(docXML);
    }

    // sprawdzanie i usuwanie starych kupionych rzeczy z listy
    removeExpired() {
        const currTime = Math.floor(new Date().getTime() / 1000);
        let c = 0;
        this.bought = this.bought.filter((elem) => {
            const diffTime = Math.floor(
                (currTime - Math.floor(elem.date) / 1000) / 3600
            );
            if (diffTime >= 2) c += 1;
            return diffTime < 2;
        });
        if (c) {
            this.showListBought();
            this.sendBoughtItems();
        }
    }

    // te kupione ktore nie wygasly sa wysylane
    sendBoughtItems() {
        const cont = this.bought
            .map(
                (elem) =>
                    `<label>${elem.label}</label><date>${new Date(
                        elem.date
                    ).toUTCString()}</date>`
            )
            .join("");

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/removeExpired.php");
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (this.responseText != null) {
                        const status = xhr.status;
                    }
                    else console.log("Błąd: nie otrzymano danych")
                }
                else console.log("Błąd: " + this.statusText)
            }
        }

        const parser = new DOMParser();
        const docXML = parser.parseFromString(
            `<root>${cont}</root>`,
            "text/xml"
        );
        xhr.send(docXML);
    }

    // odswiezenie widoku listy kupionych rzeczy
    showListBought() {
        this.boughtList.innerHTML = "";
        for (const [idx, bought] of this.bought.entries()) {
            this.appendBoughtToDom(bought, idx);
        }
    }

    // stworzenie nowej kupinej rzeczy w htmlu
    appendBoughtToDom(bought, idx) {
        const boughtDiv = document.createElement("div");
        boughtDiv.className = "boughtItem";
        boughtDiv.dataset.id = idx;
        const boughtLabel = document.createElement("p");
        boughtLabel.className = "divider";
        boughtLabel.textContent = bought.label;
        const boughtButton = document.createElement("button");
        boughtButton.textContent = '\u{21BA}';
        boughtButton.addEventListener("click", () => this.moveToToBuy(idx));
        boughtDiv.appendChild(boughtLabel);
        boughtDiv.appendChild(boughtButton);
        this.boughtList.appendChild(boughtDiv);
    }

    // przeniesienie elementu do nie kupionych rzeczy
    moveToToBuy(idx) {
        this.removeExpired();
        this.bought = this.bought.filter((t, index) => {
            if (index === idx) {
                this.toBuy.push({ label: t.label });
                return false;
            } else return true;
        });

        const elem = this.toBuy.slice(-1)[0];
        const index = this.toBuy.length - 1;

        this.updateData("to_toBuy", idx, elem);
        this.showToBuyInHTML(elem, index);
        this.showListBought();
    }

    // jesli cos zostalo przeniesione to aktualizuje plik z danymi
    updateData(where, id, elem) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "./php/updateData.php");

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (this.responseText != null) {
                        const status = xhr.status;
                        shoppingList.getListToBuy();
                    }
                    else console.log("Błąd: nie otrzymano danych")
                }
                else console.log("Błąd: " + this.statusText)
            }
        }

        let txt = ``;
        if (where === "to_bought") {
            txt = `<root><where>${where}</where><id>${id}</id><label>${elem.label}</label><date>${elem.date}</date></root>`;
        }
        else {
            txt = `<root><where>${where}</where><id>${id}</id><label>${elem.label}</label></root>`;
        }
        const parser = new DOMParser();
        const docXML = parser.parseFromString(txt, "text/xml");
        xhr.send(docXML);
    }

    checkData() {
        setInterval(() => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "./php/checkData.php");
            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        if (this.responseText != null) {
                            const currentTimestamp = this.response;
                            if(currentTimestamp != shoppingList.currTimestamp) {
                                shoppingList.currTimestamp = currentTimestamp;
                                // refresh data if file has been modified
                                shoppingList.getListToBuy();
                            }
                        }
                        else console.log("Error: no data received")
                    }
                    else console.log("Error: " + this.statusText)
                }
            }
            xhr.send();
        }, 1000);
    }
}

const shoppingList = new ShoppingList();

