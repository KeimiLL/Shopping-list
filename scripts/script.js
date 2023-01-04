class ShoppingList {
    constructor() {
        this.toBuy = [];
        this.bought = [];
        this.hints = [];
        this.currElem = "";
        this.getListToBuy();
    }

    // pobiera rzeczy do kupienia i umieszcza w tablicy toBuy
    getListToBuy() {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", "../php/getItems.php?list=toBuy");
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

        xhr.open("GET", "../php/getItems.php?list=bought");
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

        xhr.open("GET", "../php/getItems.php?list=hints");
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
        newInput.addEventListener("input", (e) => {
            this.currElem = e.target.value;
        });

        btnAdd.addEventListener("click", () => {
            if (this.currElem.trim().length) {
                this.createToBuyItem();
            }
            else {
                newInput.value = "";
                this.currElem = "";
                this.removeExpired();
            }

        });

        this.removeExpired();
        this.showListHints();
        this.showListToBuy();
        this.showListBought();
    }

    showListToBuy() {
        toBuyList.innerHTML = "";
        for (const [idx, toBuy] of this.toBuy.entries()) {
            this.appendToBuyToDom(toBuy, idx);
        }
    }

    appendToBuyToDom(toBuy, idx) {
        const toBuyDiv = document.createElement("div");
        toBuyDiv.className = "toBuy__container";
        toBuyDiv.dataset.id = idx;
        const toBuyLabel = document.createElement("p");
        toBuyLabel.className = "toBuy__label";
        toBuyLabel.textContent = toBuy.label;
        const toBuyButton = document.createElement("button");
        toBuyButton.className = "toBuy__button";
        toBuyButton.textContent = "bought";
        toBuyButton.addEventListener("click", () => this.moveToBought(idx));
        toBuyDiv.appendChild(toBuyLabel);
        toBuyDiv.appendChild(toBuyButton);
        toBuyList.appendChild(toBuyDiv);
    }

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

        this.postMovedItem("to_bought", idx, elem);
        this.showListToBuy();
        this.appendBoughtToDom(elem, index);
    }

    showListHints() {
        hintsList.innerHTML = "";
        if (this.currElem.length) {
            const foundHints = this.hints.filter((hint) =>
                hint.startsWith(this.currElem)
            );
            foundHints.forEach(hint => this.appendHintToDom(hint));
        } else {
            this.hints.forEach(hint => this.appendHintToDom(hint));
        }
    }

    appendHintToDom(hint) {
        const hintOpt = document.createElement("option");
        hintOpt.value = hint;
        hintsList.appendChild(hintOpt);
    }

    createToBuyItem() {
        this.removeExpired();
        this.toBuy.push({ label: this.currElem.trim() });
        if (this.hints.find((label) => label === this.currElem))
            this.hints.push(this.currElem);
        newInput.value = "";
        this.currElem = "";
        const idx = this.toBuy.length - 1;
        this.appendToBuyToDom(...this.toBuy.slice(-1), idx);
        this.showListHints();
        this.postNewToBuy(...this.toBuy.slice(-1));
    }

    postNewToBuy() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "../php/addToBuy.php");
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    const status = this.status;
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
            this.postRemainingBought();
        }
    }

    postRemainingBought() {
        const cont = this.bought
            .map(
                (elem) =>
                    `<label>${elem.label}</label><date>${new Date(
                        elem.date
                    ).toUTCString()}</date>`
            )
            .join("");

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "../php/removeExpired.php");
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

    showListBought() {
        boughtList.innerHTML = "";
        for (const [idx, bought] of this.bought.entries()) {
            this.appendBoughtToDom(bought, idx);
        }
    }

    appendBoughtToDom(bought, idx) {
        const boughtDiv = document.createElement("div");
        boughtDiv.className = "bought__container";
        boughtDiv.dataset.id = idx;
        const boughtLabel = document.createElement("p");
        boughtLabel.className = "bought__label";
        boughtLabel.textContent = bought.label;
        const boughtButton = document.createElement("button");
        boughtButton.className = "bought__button";
        boughtButton.textContent = "toBuy";
        boughtButton.addEventListener("click", () => this.moveToToBuy(idx));
        boughtDiv.appendChild(boughtLabel);
        boughtDiv.appendChild(boughtButton);
        boughtList.appendChild(boughtDiv);
    }

    moveToToBuy(idx) {
        this.removeExpired();
        this.bought = this.bought.filter((t, index) => {
            if (index === idx) {
                this.toBuy.push({ label: t.label });
                return false;
            } else return true;
        });

        const elem = this.bought.slice(-1)[0];
        const index = this.bought.length - 1;

        this.postMovedItem("to_toBuy", idx, elem);
        this.appendToBuyToDom(elem, index);
        this.showListBought();
    }

    postMovedItem(mode, id, elem) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "../php/moveItem.php");

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

        const content =
            mode === "to_bought"
                ? `<root><mode>${mode}</mode><id>${id}</id><label>${elem.label}</label><date>${elem.date}</date></root>`
                : `<root><mode>${mode}</mode><id>${id}</id><label>${elem.label}</label></root>`;
        const parser = new DOMParser();
        const docXML = parser.parseFromString(content, "text/xml");
        xhr.send(docXML);
    }
}

const newInput = document.querySelector('#new_input');
const btnAdd = document.querySelector('.add');
const toBuyList = document.querySelector('#to_buy');
const boughtList = document.querySelector('#bought');
const hintsList = document.querySelector('#hints');



const shoppingList = new ShoppingList(toBuyList, boughtList, hintsList);