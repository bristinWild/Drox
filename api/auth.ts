import axios from "axios";

const BASE_URL = "http://192.168.1.12:3000";
// ⚠️ If testing on real phone, replace with LAN IP
// e.g. http://192.168.1.10:3000

export async function sendOtp(phone: string) {
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
        throw new Error("Failed to send OTP");
    }

    return res.json();
}

export const getMe = async (accessToken: string) => {
    const res = await axios.get(`${BASE_URL}/user/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export async function verifyOtp(phone: string, otp: string) {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
    });

    if (!res.ok) {
        throw new Error("Invalid OTP");
    }

    return res.json(); // { accessToken, refreshToken, user }
}

export async function refreshToken(refreshToken: string) {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
        throw new Error("Refresh failed");
    }

    return res.json(); // { accessToken, refreshToken }
}


export async function checkHasPin(phone: string) {
    const res = await fetch(`${BASE_URL}/auth/has-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
    });
    return res.json(); // { exists, hasPin }
}

export async function hasPin(phone: string) {
    const res = await fetch(`${BASE_URL}/auth/has-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
    });

    if (!res.ok) throw new Error("Failed to check PIN");
    return res.json(); // { hasPin: boolean }
}

export async function loginWithPin(phone: string, pin: string) {
    const res = await fetch(`${BASE_URL}/auth/login-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
    });

    if (!res.ok) throw new Error("Invalid PIN");
    return res.json(); // { accessToken, refreshToken }
}

export async function completeOnboarding(
    accessToken: string,
    data: {
        userName: string;
        bio?: string;
        avatarUrl?: string;
    }
) {
    const res = await fetch("http://192.168.1.12:3000/user/onboarding", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to complete onboarding");
    }

    return res.json();
}




