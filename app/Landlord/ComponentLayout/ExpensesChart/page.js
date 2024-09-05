"use client"
import React from "react";
import { useState } from "react";
// import Chart from "react-apexcharts";
import dynamic from 'next/dynamic';
const ChartNoSSR = dynamic(() => import('react-apexcharts'), { ssr: false });


export default function ExpenseChart (){
   const [expenses, setExpenses] = useState({
        options: {
            chart: {
                id: "basic-bar",
            },
            xaxis: {
                categories: ["January", "February", "March", "April", "May", "June", "July", "August"],
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
                data: [ 2000, 4000, 4500, 6000, 5500, 5000, 7000, 6500],
            }, 
        ],
        
        
    })





    return (
        <>
             <ChartNoSSR options={expenses.options} series={expenses.series} type="bar" height={'100%'} width={'100%'} />
        </>
    )
}