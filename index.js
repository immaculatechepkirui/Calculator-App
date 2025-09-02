const display = document.getElementById('display');
let firstValue = '';
let operator = '';
let waitingForNext = false;

function formatDisplay(val) {
  if (isNaN(val)) return val;
  let [int, dec] = String(val).split('.');
  int = parseInt(int).toLocaleString();
  return dec !== undefined ? `${int}.${dec}` : int;
}

function updateDisplay(value) {
  display.textContent = formatDisplay(value);
}

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case 'add': return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide': return b === 0 ? 'Error' : a / b;
    default: return b;
  }
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('number')) {
      let content = btn.getAttribute('data-number');
      if (display.textContent === '0' || waitingForNext) {
        if (content === '.') {
          updateDisplay('0.');
          waitingForNext = false;
        } else {
          updateDisplay(content);
          waitingForNext = false;
        }
      } else {
        if (content === '.' && display.textContent.includes('.')) return;
        updateDisplay(display.textContent.replace(/,/g, '') + content);
      }
    } else if (btn.classList.contains('operator')) {
      const action = btn.getAttribute('data-action');
      switch (action) {
        case 'clear':
          firstValue = '';
          operator = '';
          updateDisplay('0');
          break;
        case 'plus-minus':
          let val = display.textContent.replace(/,/g, '');
          if (val === '0') break;
          updateDisplay(String(val.startsWith('-') ? val.slice(1) : '-' + val));
          break;
        case 'percent':
          updateDisplay(String(parseFloat(display.textContent.replace(/,/g, '')) / 100));
          break;
        default:
          if (operator && !waitingForNext) {
            firstValue = calculate(firstValue, display.textContent.replace(/,/g, ''), operator);
            updateDisplay(firstValue);
          } else {
            firstValue = display.textContent.replace(/,/g, '');
          }
          operator = action;
          waitingForNext = true;
      }
    } else if (btn.classList.contains('equals')) {
      if (!operator) return;
      let secondValue = display.textContent.replace(/,/g, '');
      let result = calculate(firstValue, secondValue, operator);
      updateDisplay(result);
      firstValue = result;
      operator = '';
      waitingForNext = true;
    }
  });
});