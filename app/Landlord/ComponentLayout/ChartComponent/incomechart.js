"use client"
import React from "react";
import { useState, useEffect, useCallback } from "react";
// import Chart from "react-apexcharts";
import dynamic from 'next/dynamic';
const ChartNoSSR = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function IncomeChart ({selectedMonth, selectedYear,}){
   const [income, setIncome] = useState({
        options: {
            chart: {
                id: "basic-bar",
            },
            xaxis: {
                categories: ["January", "February", "March", "April", "May", "June", "July", "August", 'September', 'October', 'November', 'December'],
            },
            fill: {
                colors: ["#93bbff"],
            },
            legend: {
                show: true,
                position: "bottom",
                horizontalAlign: "left",
            }
        },
        series: [
            {
                name: "Series-1",
                data: [],
            }, 
        ],
        
        
    })

    console.log(selectedMonth);
    console.log(selectedYear);
    console.log(income)
    // Sample data - replace with your actual data


    const fetchIncome = useCallback( async (selectedYear) => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken;

        if(accessToken){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/income_statistic`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept' : 'application/json',
                    }, 
                    body: JSON.stringify({
                        year: selectedYear
                    })
                })
                const data = await response.json();
                console.log(data.year)
                console.log(data)
                if(response.ok){
                    const monthlyRevenue = data.year; // Assuming the response payload is in "year" field
                    const monthlyData = new Array(12).fill(0); // Default array with 12 months, filled with zeros

                    // Loop through each month of the year and add the total amount
                    monthlyRevenue.forEach((entry) => {
                        const monthIndex = entry.month - 1; // Convert month (1-12) to index (0-11)
                        monthlyData[monthIndex] = parseFloat(entry.total_amount);
                    });

                    // Update the chart's series with the fetched data
                    setIncome((prevState) => ({
                        ...prevState,
                        series: [
                        {
                            name: "Income",
                            data: monthlyData,
                        },
                        ],
                    }));
                }else{
                    console.log('Error', data.error)
                    console.log('Error', data.message)
                }
            }catch(error){
                console.log(error)
            }
        }else{
            console.log('No access token found!')
        }

    }, [])

    useEffect(() => {
        fetchIncome(selectedYear);
    }, [fetchIncome,selectedYear]);





    return (
        <>
            <ChartNoSSR 
                options={income.options} 
                series={income.series} 
                type="area"
                height={'100%'}
                width={'100%'}
            />
        </>
    )
}