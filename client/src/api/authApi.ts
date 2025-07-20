import { toast } from 'sonner';
import api from './axiosInstance';

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post('/auth/register', data);
    toast.success("Registered successfully");
    console.log(res.data.user)
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Registration failed');
    throw err;
  }
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post('/auth/login', data); // ✅ fixed here
    toast.success("Logged in successfully");
    console.log(res.data.user)
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Login failed');
    throw err;
  }
};
