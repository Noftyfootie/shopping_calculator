const list = document.querySelector('.inputbody');
const calctotalup = document.querySelector('.total');
const displayTotal = document.querySelector('.sumup');
let numberInputs = document.querySelectorAll('.mynumber');

// New helper function: calculate + format total (call this whenever needed)
function calculateAndUpdateTotal() {
  const numberInputs = document.querySelectorAll('.mynumber');

  let total = 0;
  numberInputs.forEach(input => {
    const value = Number(input.value);
    if (!isNaN(value)) {
      total += value;
    }
  });

  // Format with current symbol & locale
  const formatted =
    CURRENCY_SYMBOL +
    total.toLocaleString(CURRENCY_LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  displayTotal.textContent = formatted;
}

// Update your original TOTAL button to use the same helper
calctotalup.addEventListener('click', () => {
  calculateAndUpdateTotal();
});

// working on new row
list.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === 'Tab' || e.which === 13 || e.which === 9) {
    e.preventDefault();
    if (e.target.classList.contains('mynumber')) {
      const newRow = document.createElement('tr');

      // First cell
      const td1 = document.createElement('td');
      const inputText = document.createElement('input');
      inputText.type = 'text';
      inputText.name = 'item[]';
      td1.appendChild(inputText);

      // Second cell:
      const td2 = document.createElement('td');
      const inputNumber = document.createElement('input');
      inputNumber.type = 'number';
      inputNumber.className = 'mynumber';
      inputNumber.name = 'price[]';
      inputNumber.setAttribute('enterkeyhint', 'done');
      td2.appendChild(inputNumber);

      // Puting cells into row
      newRow.appendChild(td1);
      newRow.appendChild(td2);

      // Adding the new row at the bottom
      list.appendChild(newRow);

      // move cursor to the new text field
      inputText.focus();
    }
  }
});

// Block letter 'e' and 'E' in all number inputs
document.addEventListener('keydown', function (e) {
  if (e.target.type === 'number' && (e.key === 'e' || e.key === 'E')) {
    e.preventDefault();
  }
});

// Get elements
const btnSummary = document.getElementById('btn-summary');
const modal = document.getElementById('summary-modal');
const closeModal = document.getElementById('close-modal');
const modalDate = document.getElementById('modal-date');
const modalBody = document.getElementById('modal-body');
const modalTotalValue = document.getElementById('modal-total-value');
const btnPrintModal = document.getElementById('btn-print-modal');
const btnSaveModal = document.getElementById('btn-save-modal');
const btnCloseModal = document.getElementById('btn-close-modal');

// Open modal and populate summary
btnSummary.addEventListener('click', () => {
  const itemInputs = document.querySelectorAll('.inputbody input[type="text"]');
  const priceInputs = document.querySelectorAll('.inputbody input.mynumber');

  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>ITEMS</th>
          <th>PRICES</th>
        </tr>
      </thead>
      <tbody>
  `;

  let hasData = false;
  itemInputs.forEach((itemInput, index) => {
    const item = itemInput.value.trim();
    const price = priceInputs[index]?.value.trim() || '0';
    if (item || parseFloat(price) > 0) {
      hasData = true;
      tableHTML += `
        <tr>
          <td>${item || '—'}</td>
          <td>${price}</td>
        </tr>
      `;
    }
  });

  tableHTML += '</tbody></table>';

  if (!hasData) {
    tableHTML =
      '<p style="text-align: center; color: #777;">No items entered yet.</p>';
  }

  // Set date
  modalDate.textContent = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Set table and total
  modalBody.innerHTML = tableHTML;
  modalTotalValue.textContent = displayTotal.textContent || '0.00'; // Adjust if your total element is different

  // Show modal and blur background
  modal.style.display = 'block';
  modal.scrollTop = 0;
  document.body.classList.add('modal-open');
});

// Close modal function
const closeModalFunc = () => {
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
};

// Close buttons
closeModal.addEventListener('click', closeModalFunc);
btnCloseModal.addEventListener('click', closeModalFunc);

// Close on outside click
modal.addEventListener('click', e => {
  if (e.target === modal) closeModalFunc();
});

// Print button in modal
btnPrintModal.addEventListener('click', () => {
  const printContent = modal.querySelector('.modal-content').innerHTML;
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head><title>Shopping Summary</title><style>body { font-family: Arial; padding: 20px; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 12px; } th { background: #0a0a69; color: white; }@media print {
              body { margin: 2cm; }
              .modal-actions, .close { display: none !important; }
              h2 { color: #0a0a69; }
            }</style></head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  } else {
    alert('Please allow pop-ups to print the summary.');
  }
});

// Save/Download button in modal
btnSaveModal.addEventListener('click', () => {
  const summaryText = `
Shopping Summary - ${modalDate.textContent}

ITEMS\tPRICES
${Array.from(modalBody.querySelectorAll('tbody tr'))
  .map(row => {
    const [item, price] = row.querySelectorAll('td');
    return `${item.textContent}\t${price.textContent}`;
  })
  .join('\n')}

Total: ${modalTotalValue.textContent}
  `;

  const blob = new Blob([summaryText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shopping-summary-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});
/*
const btnSummary = document.getElementById("btn-summary");

btnSummary.addEventListener("click", () => {
  console.log("1. Summary button was clicked");

  const modal = document.getElementById("summary-modal");
  if (!modal) {
    console.error("2. Modal element NOT found in DOM");
    alert("Modal HTML is missing or ID is wrong");
    return;
  }

  console.log("3. Modal element found → display should change");

  // Try to show it
  modal.style.display = "block";
  document.body.classList.add("modal-open");

  console.log("4. modal.style.display set to 'block'");
});
*/

// Theme toggle

const toggleBtn = document.getElementById('theme-toggle');
const htmlRoot = document.documentElement;

// Helper: update icon class based on current theme
function updateIcon() {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;

  const isDark = htmlRoot.getAttribute('data-theme') === 'dark';

  // Remove both possible classes first
  icon.classList.remove('fa-toggle-on', 'fa-toggle-off');

  // Add the correct one
  icon.classList.add(isDark ? 'fa-toggle-off' : 'fa-toggle-on');
}

// Load saved or system preference theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    htmlRoot.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  updateIcon();
}

// Toggle function
function toggleTheme() {
  const current = htmlRoot.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  htmlRoot.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);

  updateIcon(); // update icon immediately
}

// Initialize once
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  } else {
    console.warn('Theme toggle button not found');
  }
});

// Currency selector logic
const currencyBtn = document.getElementById('currency-selector');
const currentSymbol = document.getElementById('current-currency');
const dropdown = document.getElementById('currency-dropdown');

// Global currency settings (change here if needed)
let CURRENCY_SYMBOL = '₦';
let CURRENCY_LOCALE = 'en-NG';

// Show/hide dropdown
currencyBtn.addEventListener('click', e => {
  e.stopPropagation(); // prevent immediate close
  dropdown.classList.toggle('active');
});

// Prevent closing when clicking inside dropdown
dropdown.addEventListener('click', e => {
  e.stopPropagation();
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
  dropdown.classList.remove('active');
});

// When user picks a currency
dropdown.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    CURRENCY_SYMBOL = e.target.dataset.symbol;
    CURRENCY_LOCALE = e.target.dataset.locale;

    // Update the button display
    currentSymbol.textContent = CURRENCY_SYMBOL;

    // Hide dropdown
    dropdown.classList.remove('active');

    // Force re-calculate and re-format the total with new currency
    calculateAndUpdateTotal();
  }
});
