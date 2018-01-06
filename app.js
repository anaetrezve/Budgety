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
  

})();

const UIController = (function() {
  const DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    addBtn: '.add__btn'
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
    }

  };
})();

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
    // 1. Get the filed input data
    const input = UICtrl.getInput();
    
    // 2. Add the item to the budget controller
    // 3. Add the item to the UI
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