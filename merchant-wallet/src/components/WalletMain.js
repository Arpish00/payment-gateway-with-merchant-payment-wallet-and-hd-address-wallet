import React from 'react';

function WalletMain(props) {
  return (
    <div className="column" id="item-lists">
      {props.accounts.map((account, index) => {
        return (
          <div key={index} className="columns">
            <div className="column is-7">{account.address}</div>
            <div className="column is-2">{account.balance} ETH</div>
            <div className="column is-1 ">
              <a className="button is-info" onClick={() => props.getAccountTransactions(account.address)}>
                View Transactions
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WalletMain;
