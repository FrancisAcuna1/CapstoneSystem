"use client";
import React from "react";
import { useState, useEffect } from "react";
import Script from "next/script";
import { Box } from "@mui/material";
import "/app/style.css";


const clientId = "92faba3c-910a-4608-adaf-2f80e11a1f98";
const botId = "d71fc4c5-c26f-4f2c-beb1-3e3c063173a4";
export default function Botpress() {

  return (
    <div>
      <Script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js" />
      <Script src="https://files.bpcontent.cloud/2025/01/10/10/20250110102202-L436PWXR.js" />
    </div>
  );
}
