class ShoppingList {
    constructor() {
        this.toBuy = [];
        this.bought = [];
        this.hints = [];
        this.showList();
    }

    // pobiera rzeczy do kupienia i umieszcza w tablicy toBuy
    getListToBuy() {
        const xhr = new XMLHttpRequest();
        
        xhr.open("GET", "getXML.php?list=toBuy");
        // lista toBuy - lista produktow do kupienia
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (this.responseText != null) {
                        const dataXML = this.response;
                        const parser = new DOMParser();
                        const docXML = parser.parseFromString(dataXML, "text/xml");
                        docXML.querySelectorAll("label").forEach(element => shoppingList.toBuy.push({label: element.textContent}));
                        shoppingList.showBought();
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
        
        xhr.open("GET", "getXML.php?list=bought");
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
        
        xhr.open("GET", "getXML.php?list=hints");
        // lista hints - lista podpowiedzi
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (this.responseText != null) {
                        const dataXML = this.response;
                        const parser = new DOMParser();
                        const docXML = parser.parseFromString(dataXML, "text/xml");
                        docXML.querySelectorAll("label").forEach(element => shoppingList.hints.push({label: element.textContent}));
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

    // 
    showContent() {

    }

}

const newInput = document.querySelector('#new_input');
const btnAdd = document.querySelector('.add');
const toBuyList = document.querySelector('#to_buy');
const boughtList = document.querySelector('#bought');

const shoppingList = new ShoppingList(newInput, btnAdd, toBuyList, boughtList);