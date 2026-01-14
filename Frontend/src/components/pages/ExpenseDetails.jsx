import React from 'react'
import { useParams } from 'react-router-dom'
const ExpenseDetails = () => {
   const { id: expenseId } = useParams();
   console.log("expenseId---------->",expenseId);
  return (
    <div>ExpenseDetails</div>
  )
}

export default ExpenseDetails