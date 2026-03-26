class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === 'Error' || this.currentOperand === 'Infinity' || this.currentOperand === 'NaN') {
            this.clear();
            return;
        }
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (this.currentOperand === 'Error' || this.currentOperand === 'Infinity' || this.currentOperand === 'NaN') {
            this.currentOperand = '0';
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') return;
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            case '%':
                computation = prev % current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        // Handle precision issues gently
        if (typeof computation === 'number') {
             computation = Math.round(computation * 10000000000) / 10000000000;
        }
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    computeScientific(operation) {
        let current = parseFloat(this.currentOperand);
        if (isNaN(current) && operation !== 'pi' && operation !== 'e') {
            return;
        }

        let computation;
        switch (operation) {
            case 'sin':
                computation = Math.sin(current);
                break;
            case 'cos':
                computation = Math.cos(current);
                break;
            case 'tan':
                computation = Math.tan(current);
                break;
            case 'ln':
                computation = current > 0 ? Math.log(current) : 'Error';
                break;
            case 'log':
                computation = current > 0 ? Math.log10(current) : 'Error';
                break;
            case '√':
                computation = current >= 0 ? Math.sqrt(current) : 'Error';
                break;
            case '!':
                if (current < 0 || !Number.isInteger(current)) {
                    computation = 'Error';
                } else {
                    computation = this.factorial(current);
                }
                break;
            case 'x2':
                computation = Math.pow(current, 2);
                break;
            case '1/x':
                computation = current !== 0 ? 1 / current : 'Error';
                break;
            case 'pi':
                computation = Math.PI;
                break;
            case 'e':
                computation = Math.E;
                break;
            default:
                return;
        }
        
        if (typeof computation === 'number') {
             computation = Math.round(computation * 10000000000) / 10000000000;
        }
        
        this.currentOperand = computation.toString();
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    getDisplayNumber(number) {
        if (number === 'Error' || number === 'Infinity' || number === 'NaN') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation === '^' ? '^' : this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const calculatorElement = document.getElementById('calculator');
const modeToggleBtn = document.getElementById('mode-toggle');
const scientificPad = document.getElementById('scientific-pad');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

document.querySelectorAll('.btn-number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.value);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('.btn-operator').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.value);
        calculator.updateDisplay();
    });
});

document.querySelector('.btn-equals').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Scientific Mode toggle
modeToggleBtn.addEventListener('click', () => {
    calculatorElement.classList.toggle('scientific-mode');
    scientificPad.classList.toggle('hidden');
    
    if (scientificPad.classList.contains('hidden')) {
        modeToggleBtn.innerText = 'Scientific';
    } else {
        modeToggleBtn.innerText = 'Standard';
    }
});

// Scientific Operations
document.querySelectorAll('.btn-sci').forEach(button => {
    button.addEventListener('click', () => {
        const val = button.dataset.value;
        if (val === '^') {
            calculator.chooseOperation('^');
            calculator.updateDisplay();
        } else {
            // Unary scientific operations
            calculator.computeScientific(val);
            calculator.updateDisplay();
        }
    });
});
