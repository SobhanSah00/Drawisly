"use client"

import React, { useEffect, useState } from 'react'

const API_URL = "http://localhost:5050/api/v1/auth"

export default function useExtractToken() {
    const [token, setToken] = useState<any>()

    useEffect(() => {
        const handleGetToken = async () => {
            try {
                const res = await fetch(`${API_URL}/getToken`, {
                    credentials: "include"
                })

                const data = await res.json()
                if (res.ok && data?.token) {
                    setToken(data.token)
                }
            } catch (error) {
                console.error("Error fetching roomId", error);
            }
        }
        handleGetToken()
    },[])

    return [token];
}