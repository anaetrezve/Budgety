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
    },
    budget: 0,
    persentage: null
  };

  // Calculate total 
  const calculateTotal = function(type) {
    let sum = 0; 
    data.allItems[type].forEach(current => {
      sum += current.value;
    });
    data.totals[type] = sum;
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
    },
    getData: function() {
      return data;
    },
    calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the persentage of income that we spent
      if(data.totals.inc > 0) {
        data.persentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        persentage: data.persentage
      };
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    persentage: '.budget__expenses--percentage'
  };

  return {

    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // INC | EXP
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
    clearFields: function() {
      let fields, fieldsArr;
      // document.querySelector(DOMStrings.inputDescription).value = "";
      // document.querySelector(DOMStrings.inputValue).value = "";
      fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, fieldsArr) {
        current.value = '';
      });
      fields[0].focus();
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
          </div>`
        );
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
          </div>`
        );
      }
    },
    displayBudget: function(obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = "+ " + obj.totalInc;
      document.querySelector(DOMStrings.expensesLabel).textContent = '- ' + obj.totalExp;

      if(obj.persentage > 0) {
        document.querySelector(DOMStrings.persentage).textContent = obj.persentage + "%";
      } else {
        document.querySelector(DOMStrings.persentage).textContent = "__";
      }

    },

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

  // Update and Calculate budget
  const updateBudget = function() {

    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    let budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI 
    UICtrl.displayBudget(budget);
  };

  const addItemCtrl = function() {
    let input, newItem;
    // 1. Get the filed input data
    input = UICtrl.getInput();
    
    if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // Clearing the input fields
      UICtrl.clearFields();
    }

    updateBudget();
    
  };

  return {
    init: function() {
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        persentage: -1
      });
    }
  };

})(budgetController, UIController);

controller.init();
