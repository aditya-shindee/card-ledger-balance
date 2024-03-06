class CardGameLedger {
  constructor(playerNames) {
    this.balances = playerNames.reduce((acc, name) => {
      acc[name] = 0;
      return acc;
    }, {});
  }

  updateBalance(winnerName, betAmount) {
    const totalAmount = betAmount * Object.keys(this.balances).length;
    Object.keys(this.balances).forEach(name => {
      if (name === winnerName) {
        this.balances[name] += (totalAmount - betAmount);
      } else {
        this.balances[name] -= betAmount;
      }
    });
  }

  calculateSettlements() {
    const creditors = Object.fromEntries(Object.entries(this.balances).filter(([_, v]) => v > 0));
    const debtors = Object.fromEntries(Object.entries(this.balances).filter(([_, v]) => v < 0));
    const settlements = [];

    while (Object.keys(debtors).length > 0 && Object.keys(creditors).length > 0) {
      const [debtorName, debtorAmount] = Object.entries(debtors).reduce((prev, curr) => curr[1] < prev[1] ? curr : prev);
      const [creditorName, creditorAmount] = Object.entries(creditors).reduce((prev, curr) => curr[1] > prev[1] ? curr : prev);

      const payment = Math.min(-debtorAmount, creditorAmount);
      settlements.push([debtorName, creditorName, payment]);

      creditors[creditorName] -= payment;
      debtors[debtorName] += payment;

      if (creditors[creditorName] === 0) {
        delete creditors[creditorName];
      }
      if (debtors[debtorName] === 0) {
        delete debtors[debtorName];
      }
    }

    return settlements;
  }
}

// Example usage:
let gameLedger = new CardGameLedger(['Alice', 'Bob', 'Charlie']);
gameLedger.updateBalance('Bob', 10);
console.log(gameLedger.calculateSettlements());
