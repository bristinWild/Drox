import axios from 'axios';
import { getAccessToken } from '@/constants/auth';

const BASE_URL = 'http://192.168.1.12:3000';

export async function joinActivity(activityId: string) {
    const token = await getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const res = await axios.post(
        `${BASE_URL}/participation/${activityId}/join`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
}

export async function checkJoiningStatus(activityId: string) {
    const token = await getAccessToken();
    if (!token) throw new Error("Not authenticated");

    const res = await axios.get(
        `${BASE_URL}/participation/${activityId}/check-status`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data as { hasJoined: boolean };
}

export async function getMyBookings() {
    const token = await getAccessToken();
    if (!token) throw new Error("Not authenticated");

    const res = await axios.get(
        `${BASE_URL}/participation/check-all-bookings`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
}
