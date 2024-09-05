"use client"
import React from "react";
import { useState } from "react";
// import Chart from "react-apexcharts";
import dynamic from 'next/dynamic';
const ChartNoSSR = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function IncomeChart (){
   const [expenses, setExpenses] = useState({
        options: {
            chart: {
                id: "basic-bar",
            },
            xaxis: {
                categories: ["January", "February", "March", "April", "May", "June", "July", "August", ],
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
                data: [2000, 4000, 5000, 4500, 6000, 5500, 3000, 4500,],
            }, 
        ],
        
        
    })





    return (
        <>
             <ChartNoSSR options={expenses.options} series={expenses.series} type="area" height={'100%'} width={'100%'} />
        </>
    )
}