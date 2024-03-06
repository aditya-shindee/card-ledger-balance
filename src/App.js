import React, { useState } from 'react';
import './App.css';

class CardGameLedger {
  constructor(playerNames) {
    this.balances = playerNames.reduce((acc, name) => {
      acc[name] = 0;
      return acc;
    }, {});
  }

  updateBalance(winnerName, betAmount) {
    const winnerNameLower = winnerName.toLowerCase();
    const totalAmount = betAmount * Object.keys(this.balances).length;
    Object.keys(this.balances).forEach(name => {
      if (name === winnerNameLower) {
        this.balances[name] += totalAmount - betAmount;
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

function App() {
  const [playerNames, setPlayerNames] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [winnerName, setWinnerName] = useState('');
  const [ledger, setLedger] = useState(null);
  const [settlements, setSettlements] = useState([]);

  const handleInitializeGame = () => {
    const namesArray = playerNames.split(',').map(name => name.trim().toLowerCase());
    setLedger(new CardGameLedger(namesArray));
  };

  const handleUpdateBalance = () => {
    if (!ledger || betAmount === '' || winnerName === '') {
      alert('Please make sure the game is initialized, a winner is selected, and a bet amount is entered.');
      return;
    }
    ledger.updateBalance(winnerName, parseFloat(betAmount));
    alert('Balance updated');
  };

  const handleDisplaySettlement = () => {
    if (!ledger) {
      alert('Please initialize the game and update balances first.');
      return;
    }
    const newSettlements = ledger.calculateSettlements();
    setSettlements(newSettlements);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Card Game Ledger</h1>
      </header>
      <main className="app-content">
        <form className="input-form">
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="Enter player names separated by commas"
              value={playerNames}
              onChange={(e) => setPlayerNames(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="number"
              className="input-field"
              placeholder="Bet amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="Winner's name"
              value={winnerName}
              onChange={(e) => setWinnerName(e.target.value)}
            />
          </div>
        </form>
      </main>
      <div className="button-group">
            <button className="btn" onClick={handleInitializeGame}>Initialize Game</button>
            <button className="btn" onClick={handleUpdateBalance}>Update Balance</button>
            <button className="btn" onClick={handleDisplaySettlement}>Display Settlement</button>
      </div>
      <div className="settlements">
          {settlements.map(([debtor, creditor, amount], index) => (
            <p className="settlement" key={index}>{`${creditor} should receive ₹${amount} from ${debtor}`}</p>
          ))}
        </div>
    </div>
  );
}

export default App;
