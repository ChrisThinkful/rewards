import React, { useState, useEffect } from "react";
import { transactions } from "./data/transactions.js";
import "./RewardsCalc.css";

const fetchSimulator = () => {
    // simulate fetch
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(transactions);
    }, 1000);
  });
};

const RewardsCalc = () => {
  const [rewardPoints, setRewardPoints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSimulator();
        // create object to store rewards by customer
        const rewardsByCustomer = {};
        // loop through transactions
        data.forEach((transaction) => {
          const { id, date, amount } = transaction;
          // calculate points
          const points = Math.floor(
            // points for every dollar spent over $100
            Math.max(0, (amount - 100) * 2) +
            // plus 1 point for every dollar spent over $50 up to $100
              Math.max(0, Math.min((amount - 50, 50)))
          );
            // month name for each transaction
          const month = new Date(date).toLocaleString("default", {
            month: "long",
          });
          // if customer id doesn't exist, create it
          if (!rewardsByCustomer[id]) {
            rewardsByCustomer[id] = { total: 0, month: {} };
          }
          // if month doesn't exist, create it
          if (!rewardsByCustomer[id].month[month]) {
            rewardsByCustomer[id].month[month] = 0;
          }
          // add points to total and month
          rewardsByCustomer[id].total += points;
          rewardsByCustomer[id].month[month] += points;
        });
        // set state
        setRewardPoints(rewardsByCustomer);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>Customer Rewards</h1>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total</th>
            <th>Month</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(rewardPoints).map(([customerId, pointsData]) => {
            const { total, month } = pointsData;
            return (
              <tr key={customerId}>
                <td>{customerId}</td>
                <td>{total}</td>
                <td>
                  <table className="monthsTable">
                    <tbody>
                      {Object.entries(month).map(([monthName, points]) => (
                        <tr key={monthName}>
                          <td>{monthName}: </td>
                          <td>{points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default RewardsCalc;
