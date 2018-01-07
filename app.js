// =================================
// Budget Controller
// =================================

const budgetController = (function() {

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    totals: {
      inc: 0,
      exp: 0
    },
    allItems: {
      inc: [],
      exp: []
    }

  };
  
  return {
    addItem: function(type, des, val) {
      let newItem, id;
      // [1, 3, 4, 5] next id should be 6
      // [1, 2, 4, 6] next id should be 7
      // id = last id + 1

      // Create new id
      if(data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }
      
      // Create new item besed on exp or inc
      if(type === 'inc') {
        newItem = new Income(id, des, val);
      } else if(type === 'exp') {
        newItem = new Expense(id, des, val);
      }

      // Push into data structure
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    }

  };

})();

// =================================
// UI Controller
// =================================

const UIController = (function() {
  const DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    addBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  };

  return {

    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // INC | EXP
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
    addListItem: function(obj, type) {
      /*let html, newHTML, element;
      // Create HTML string with placeholder text
      if(type === 'inc') {
        element = document.querySelector(DOMStrings.incomeContainer);

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if(type === 'exp') {
        element = document.querySelector(DOMStrings.expensesContainer);

        html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
      }

      // Replace placeholder text with some actual data
      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', obj.value);

      // insert HTML data to DOM
      element.insertAdjacentHTML('beforeend', newHTML);
      */

      // Using ES6 
      if(type === 'inc') {
        document.querySelector(DOMStrings.incomeContainer).insertAdjacentHTML(
          'beforeend', 
          `<div class="item clearfix" id="income-${obj.id}">
              <div class="item__description">${obj.description}</div>
              <div class="right clearfix">
                  <div class="item__value">${obj.value}</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
            </div>`);
      } else if(type === 'exp') {
        document.querySelector(DOMStrings.expensesContainer).insertAdjacentHTML(
          'beforeend',
          `<div class="item clearfix" id="expense-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">${obj.value}</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
          </div>`);
      }

    }

  };
})();


// =================================
// Controller
// =================================
const controller = (function(budgetCtrl, UICtrl) {

  const setupEventListeners = function() {
    const DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.addBtn).addEventListener('click', addItemCtrl);

    document.addEventListener('keypress', function(evt) {
      if(evt.keyCode === 13 || evt.which === 13) {
        addItemCtrl();
      }
    });
  };

  const addItemCtrl = function() {
    let input, newItem;
    // 1. Get the filed input data
    input = UICtrl.getInput();
    
    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);
    // 4. Calculate the budget

    // 5. Display the budget on the UI
    
  };

  return {
    init: function() {
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();
