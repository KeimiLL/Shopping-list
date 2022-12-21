class ShoppingList {
    constructor() {
        this.toBuy = [];
        this.bought = [];
    }


}

const newInput = document.querySelector('#new_input');
const btnAdd = document.querySelector('.add');
const toBuyList = document.querySelector('#to_buy');
const boughtList = document.querySelector('#bought');

const shoppingList = new ShoppingList(newInput, btnAdd, toBuyList, boughtList);