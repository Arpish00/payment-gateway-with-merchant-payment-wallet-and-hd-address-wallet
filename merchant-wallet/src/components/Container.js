import React from 'react'
import { Component } from 'react'
import WalletTrans from './WalletTrans'
import TransHeader from './TransHeader'
import WalletMain from './WalletMain'


class Container extends Component {

        
    render(){
    return (
        <section className="container is-full">
            <div className="columns is-mobile">
                {
                    this.props.acc? 
                    <div>
                        <TransHeader />

                        <div className='panel'>
                            <WalletTrans transactions={this.props.transactions} acc={this.props.acc}/>
                            
                        </div>
                    </div>
                    

                    :
                    <div className="column is-8 is-offset-2">
                    <div className="panel">
                    <div className="panel-block is-paddingless is-12" >
                    
                    <WalletMain accounts={this.props.accounts}  
                            getAccountTransactions={this.props.getAccountTransactions}/>
                    </div>
                    </div>
                    </div>
                }
            </div>
        </section>
    )
    }
}

export default Container;