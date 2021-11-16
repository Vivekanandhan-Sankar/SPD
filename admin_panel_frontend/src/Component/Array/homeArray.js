import insurance from '../../Images/insurance.jfif';
import loan from '../../Images/loan.jfif';
import card from '../../Images/card.jfif';
import acoount from '../../Images/acoount.jfif';
import gold from '../../Images/gold_loan.jfif';
var comps = [
    {
        images:acoount,
        operation:"Accounts Mantainance",
        content:"Approved,Pending,Rejected",
        routess:"accounts",
        approva:"updateAccount"
    },
    {
        images:loan,
        operation:"Loan Section",
        content:"Approved,Pending,Rejected",
        routess:"loans",
        approva:"updateLoan"
    },
    { 
        images:card,
        operation:"Cards Section",
        content:"Credit card and Debit card",
        routess:"cards",
        approva:"updateCard"
    },
    {
        images:insurance,
        operation:"Insurance Section",
        content:"Personal, Car",
        routess:"insurances",
        approva:"updateInsurance"
    },
    {
        images:gold,
        operation:"Gold Loans",
        content:"Interests, Debts",
        routess:"golds",
        approva:"updategold"
    }
]

export default comps;