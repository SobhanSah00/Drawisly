import { cookies } from "next/headers";

async (config: any) => {
    let token: string | undefined;

    if (typeof window === "undefined") {
        const cookieStore = await cookies();
        token = cookieStore.get("jwt")?.value;
    } else {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(";").shift();
        };
        token = getCookie("jwt");
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}