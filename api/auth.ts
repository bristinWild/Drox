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

export async function verifyOtp(phone: string, otp: string) {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
    });

    if (!res.ok) {
        throw new Error("Invalid OTP");
    }

    return res.json();
}
