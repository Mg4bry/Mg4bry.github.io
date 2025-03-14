class Calculator {
  constructor() {
    this.previousOperandElement = document.getElementById('previousOperand');
    this.currentOperandElement = document.getElementById('currentOperand');
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Numeri
    document.querySelectorAll('.number').forEach(button => {
      button.addEventListener('click', () => {
        this.appendNumber(button.dataset.number);
      });
    });
    
    // Operatori
    document.querySelectorAll('.operator').forEach(button => {
      button.addEventListener('click', () => {
        this.chooseOperation(button.dataset.action);
      });
    });
    
    // Funzioni
    document.querySelectorAll('.function').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'clear') this.clear();
        if (action === 'delete') this.delete();
        if (action === 'percent') this.percent();
      });
    });
    
    // Uguale
    document.querySelector('.equals').addEventListener('click', () => {
      this.calculate();
    });
    
    // Tastiera
    document.addEventListener('keydown', this.handleKeyboardInput.bind(this));
  }
  
  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }
    
    // Impedisci più punti decimali
    if (number === '.' && this.currentOperand.includes('.')) return;
    
    // Sostituisci lo 0 iniziale a meno che non sia un punto decimale
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
    
    this.updateDisplay();
  }
  
  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    
    if (this.previousOperand !== '') {
      this.calculate();
    }
    
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
    this.updateDisplay();
  }
  
  calculate() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (this.operation) {
      case 'add':
        computation = prev + current;
        break;
      case 'subtract':
        computation = prev - current;
        break;
      case 'multiply':
        computation = prev * current;
        break;
      case 'divide':
        if (current === 0) {
          this.currentOperand = 'Errore';
          this.previousOperand = '';
          this.operation = undefined;
          this.updateDisplay();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }
    
    // Arrotonda per evitare problemi di precisione con i numeri decimali
    this.currentOperand = Math.round(computation * 1000000) / 1000000;
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
    this.updateDisplay();
  }
  
  percent() {
    this.currentOperand = parseFloat(this.currentOperand) / 100;
    this.updateDisplay();
  }
  
  delete() {
    if (this.currentOperand === '0') return;
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }
  
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.updateDisplay();
  }
  
  updateDisplay() {
    this.currentOperandElement.textContent = this.formatDisplayNumber(this.currentOperand);
    
    if (this.operation) {
      let operationSymbol;
      switch (this.operation) {
        case 'add': operationSymbol = '+'; break;
        case 'subtract': operationSymbol = '−'; break;
        case 'multiply': operationSymbol = '×'; break;
        case 'divide': operationSymbol = '÷'; break;
      }
      this.previousOperandElement.textContent = `${this.formatDisplayNumber(this.previousOperand)} ${operationSymbol}`;
    } else {
      this.previousOperandElement.textContent = '';
    }
  }
  
  formatDisplayNumber(number) {
    if (number === 'Errore') return number;
    
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('it-IT', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
      return `${integerDisplay},${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }
  
  handleKeyboardInput(e) {
    // Numeri e punto decimale
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      this.appendNumber(e.key);
    }
    
    // Operatori
    if (e.key === '+') this.chooseOperation('add');
    if (e.key === '-') this.chooseOperation('subtract');
    if (e.key === '*') this.chooseOperation('multiply');
    if (e.key === '/') this.chooseOperation('divide');
    
    // Uguale e Invio
    if (e.key === '=' || e.key === 'Enter') {
      e.preventDefault();
      this.calculate();
    }
    
    // Backspace
    if (e.key === 'Backspace') this.delete();
    
    // Escape
    if (e.key === 'Escape') this.clear();
    
    // Percentuale
    if (e.key === '%') this.percent();
  }
}

// Inizializza la calcolatrice
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});