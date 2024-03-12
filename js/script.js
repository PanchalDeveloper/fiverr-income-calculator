const fillForm = (index = -1) => {
  const history = JSON.parse(localStorage.getItem('history')) || [];

  const historyEntry = (index >= 0) ? history[index] : history[history.length + index];

  if (!historyEntry) {
    return;
  }

  document.getElementById('amount').value = historyEntry.amount || 100;
  document.getElementById('paypal-conv-rate').value = historyEntry.paypalConvRate || 79.88;
  document.getElementById('payoneer-conv-rate').value = historyEntry.payoneerConvRate || 82;
  document.getElementById('paypal-fee').value = historyEntry.paypalFee || 0;
  document.getElementById('payoneer-fee').value = historyEntry.payoneerFee || 3;
  document.getElementById('currency').value = historyEntry.currency || "INR";
  // Set other fields as needed
}

const saveToCalcHistory = (historyItem, historyLimit = 10) => {
  let history = JSON.parse(localStorage.getItem('history')) || [];
  history.push(historyItem);

  if (history.length > historyLimit) {
    history = history.slice(history.length - historyLimit)
  }

  localStorage.setItem('history', JSON.stringify(history));
}

const updateCalcHistoryView = () => {
  const history = JSON.parse(localStorage.getItem('history')) || [];
  let historyHtml = '';
  if (history?.length == 0) {
    historyHtml = `<h6 class="text-center text-capitalize fw-semibold">History not Available</h6>`;
  }
  else {
    for (let i = 0; i < history.length; i++) {
      historyHtml += `<div class="history-item row mb-2" onclick="fillForm(${i})">
                            <div class="col"><span>$${history[i].amount.toFixed(2)}</span></div>
                            <div class="col text-center"><span>${history[i].currency}</span></div>
                            <div class="col text-end">
                            <button type="button" class="copy-btn p-2 rounded border-0 mx-2" onclick="fillForm(${i})"><i class="fa-regular fa-copy"></i></button>
                            <button type="button" class="delete-btn text-danger p-2 rounded border-0 mx-2" onclick="deleteCalcHistory(${i})"><i class="fa-regular fa-trash-can"></i></button>
                            </div>
                        </div>`;
    }
  }
  document.getElementById('historyBody').innerHTML = historyHtml;
}

const deleteCalcHistory = (index) => {
  let history = JSON.parse(localStorage.getItem('history')) || [];
  history.splice(index, 1);
  localStorage.setItem('history', JSON.stringify(history));
  updateCalcHistoryView();
}

const clearCalcHistory = () => {
  localStorage.removeItem('history');
  updateCalcHistoryView();
}

const calculateIncome = () => {
  let amount = parseFloat(document.getElementById('amount').value) || 100;
  let paypalConvRate = parseFloat(document.getElementById('paypal-conv-rate').value) || 79.88;
  let payoneerConvRate = parseFloat(document.getElementById('payoneer-conv-rate').value) || 82;
  let paypalFee = parseFloat(document.getElementById('paypal-fee').value) || 0;
  let payoneerFee = parseFloat(document.getElementById('payoneer-fee').value) || 3;
  const currency = document.getElementById('currency').value;

  const paypalTotal = (amount - paypalFee) * paypalConvRate;
  const payoneerTotal = (amount - payoneerFee) * payoneerConvRate;

  const payoneerIsBeneficial = paypalTotal < payoneerTotal;

  const resultText = `<p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
                      <p><strong>PayPal Total:</strong> ${currency} ${paypalTotal.toFixed(2)}</p>
                      <p><strong>Payoneer Total:</strong> ${currency} ${payoneerTotal.toFixed(2)}</p>
                      <p><strong>Best Withdraw Available Via:</strong> ${payoneerIsBeneficial ? 'Payoneer' : 'PayPal'}</p>`;

  document.getElementById('resultText').innerHTML = resultText;

  // Save to history
  const historyItem = {
    amount,
    paypalConvRate,
    payoneerConvRate,
    paypalFee,
    payoneerFee,
    currency,
    paypalTotal,
    payoneerTotal,
    payoneerIsBeneficial,
  };
  saveToCalcHistory(historyItem);
  updateCalcHistoryView();
}

const init = () => {
  const calculateIncomeBtn = document.getElementById('calculateIncomeBtn');
  calculateIncomeBtn.addEventListener('click', calculateIncome);
  
  // Fill form from last History
  fillForm();

  // Refresh history within History View Area
  updateCalcHistoryView();

}


// Run "init" Function after DOM is Loaded
document.addEventListener("DOMContentLoaded", init);