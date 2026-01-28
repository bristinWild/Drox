import axios from "axios";


const BASE_URL = "http://192.168.1.12:3000";


export interface Activity {
    id: string;
    title: string;
    description: string;
    isPaid: boolean;
    fee: string;
    location: {
        name: string;
        address: string;
        lat: number;
        lng: number;
    };
    images: string[];
    createdByUserId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateActivityPayload {
    title: string;
    location: {
        name: string;
        address: string;
        lat: number;
        lng: number;
    };
    description?: string;
    isPaid: boolean;
    fee?: number;
    payment?: {
        flow: string;
        currency: string;
    } | null;
    images: string[];
}

export const createActivity = async (
    accessToken: string,
    payload: CreateActivityPayload
) => {
    const res = await axios.post(`${BASE_URL}/activity`, payload, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const getActivities = async (accessToken: string): Promise<Activity[]> => {
    const res = await axios.get(`${BASE_URL}/activity`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const getUserHostedActivities = async (accessToken: string): Promise<Activity[]> => {
    const res = await axios.get(`${BASE_URL}/activity/user/activities`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};