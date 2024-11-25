"use client"
import React from "react";
import { useState, useEffect, useCallback } from "react";
// import Chart from "react-apexcharts";
import dynamic from 'next/dynamic';
const ChartNoSSR = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function ExpenseChart ({selectedMonth, selectedYear}){
   const [expenses, setExpenses] = useState({
        options: {
            chart: {
                id: "basic-bar",
            },
            xaxis: {
                categories: ["January", "February", "March", "April", "May", "June", "July", "August", 'September', 'October', 'November', 'December'],
            },
            fill: {
                colors: ["#9575cd"],
            },
            legend: {
                show: true,
                position: "bottom",
                horizontalAlign: "left",
            },
        },
        series: [
            {
                name: "Series-1",
                data: [],
            }, 
        ],
        
    })

    const fetchTotalExpenses = useCallback( async(selectedYear) => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken;

        if(accessToken){
            try{
                const response = await fetch('http://127.0.0.1:8000/api/expenses_statistic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        year: selectedYear
                    })
                })
                const data = await response.json();
                
                if (!response.ok) throw new Error("Failed to fetch expenses");
                const monthlyExpenses = data?.monthly_expenses || [];
                const monthlyData = new Array(12).fill(0);

                monthlyExpenses.forEach((entry) => {
                    const monthIndex = entry.month - 1; // Convert month (1-12) to index (0-11)
                    monthlyData[monthIndex] = entry.total;
                });
                setExpenses((prevState) => ({
                    ...prevState,
                    series: [
                        {
                            name: "Expenses",
                            data: monthlyData,
                        },
                    ],
                }));
            }catch(error){
                console.log(error)
            }
        }
    }, [])

    useEffect(() => {
        fetchTotalExpenses(selectedYear);
    }, [fetchTotalExpenses, selectedYear])





    return (
        <>
             <ChartNoSSR 
             options={expenses.options} 
             series={expenses.series} 
             type="bar" 
             height={'100%'} 
             width={'100%'}/>
        </>
    )
}