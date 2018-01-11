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
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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

    deleteItem: function(type, id) {
      let ids, index;
      // id = 6
      // data.allItems[type][id]
      // ids = [1, 2, 4, 6, 8]
      // index = 3
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index, 1);
      }

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

    calculatePercentages: function() {

      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });

    },

    getPercentage: function() {

      let allPercent = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      
      return allPercent;
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
    persentage: '.budget__expenses--percentage',
    container: '.container',
    expPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  // Format numbers before display on UI 
  const formatNumber = function(type, num) {
    let n, num2;
    num = Math.abs(num);
    num = num.toFixed(2);
    num2 = num.split('.');
    
    if(num2[0].length > 3) {
      n = num2[0].substring(0, num2[0].length - 3) + ',' + num2[0].substring(num2[0].length - 3) + '.' + num2[1];
    } else {
      n = num;
    }

    return (type === 'inc' ? '+ ' : '- ') + n;
  };

  const nodeForEach = function(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
      callback(arr[i], i);
    }
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
          `<div class="item clearfix" id="inc-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">${formatNumber(type, obj.value)}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
          </div>`
        );
      } else if(type === 'exp') {
        document.querySelector(DOMStrings.expensesContainer).insertAdjacentHTML(
          'beforeend',
          `<div class="item clearfix" id="exp-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">${formatNumber(type, obj.value)}</div>
                <div class="item__percentage">1%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
          </div>`
        );
      }
    },

    deleteListItem: function(selectorId) {
      let el = document.getElementById(selectorId);
      // el.parentNode.removeChild(el);
      el.remove();
    },

    displayBudget: function(obj) {
      let type;
      
      obj.budget >= 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(type, obj.budget);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber('inc', obj.totalInc);
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber('exp', obj.totalExp);

      if(obj.persentage > 0) {
        document.querySelector(DOMStrings.persentage).textContent = obj.persentage + "%";
      } else {
        document.querySelector(DOMStrings.persentage).textContent = "__";
      }

    },

    displayPercentages: function(percentages) {
      let fields = document.querySelectorAll(DOMStrings.expPercentageLabel);

      nodeForEach(fields, function(cur, index) {
        // do some stuff
        
        if (percentages[index] > 0) {
          
          cur.textContent = percentages[index] + '%';
        } else {
          cur.textContent = '---';
        } 

      });
    },

    displayDate: function() {
      let now, month, year, monthList;
      now = new Date();
      monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      year = now.getFullYear();
      month = now.getMonth();

      document.querySelector(DOMStrings.dateLabel).textContent = monthList[month] + ' ' + year;
    },

    changedInput: function() {
      let fields = document.querySelectorAll(`${DOMStrings.inputType}, ${DOMStrings.inputValue}, ${DOMStrings.inputDescription}`);

      nodeForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMStrings.addBtn).classList.toggle('red');
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedInput);
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

  const updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();
    
    // 2. Read percentages from the budget controller
    let percent = budgetCtrl.getPercentage();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percent);
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

    updatePercentages();
  };

  const ctrlDeleteItem = function(event) {
    let type, id, splitID, itemID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    splitID = itemID.split('-');
    id = parseInt(splitID[1]);
    type = splitID[0];

    if(event.target.parentElement.nodeName === 'BUTTON') {
      // 1. Delete the item from data Structure 
      budgetCtrl.deleteItem(type, id);

      // 2. Delete the item from UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }

  };

  return {
    init: function() {
      UICtrl.displayDate();
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
