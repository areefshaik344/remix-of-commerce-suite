import { httpClient } from "./httpClient";
import { ENDPOINTS } from "./endpoints";

export const userApi = {
  async getProfile() {
    const res = await httpClient.get(ENDPOINTS.USER.PROFILE);
    return res.data?.data || res.data;
  },

  async updateProfile(data: Record<string, unknown>) {
    const res = await httpClient.put(ENDPOINTS.USER.UPDATE_PROFILE, data);
    return res.data?.data || res.data;
  },

  async getAddresses() {
    const res = await httpClient.get(ENDPOINTS.USER.ADDRESSES);
    return res.data?.data || res.data;
  },

  async addAddress(data: Record<string, unknown>) {
    const res = await httpClient.post(ENDPOINTS.USER.ADDRESSES, data);
    return res.data?.data || res.data;
  },

  async updateAddress(addressId: string, data: Record<string, unknown>) {
    const res = await httpClient.put(ENDPOINTS.USER.ADDRESS_DETAIL(addressId), data);
    return res.data?.data || res.data;
  },

  async deleteAddress(addressId: string) {
    await httpClient.delete(ENDPOINTS.USER.ADDRESS_DETAIL(addressId));
  },

  async setDefaultAddress(addressId: string) {
    const res = await httpClient.patch(ENDPOINTS.USER.ADDRESS_DEFAULT(addressId));
    return res.data?.data || res.data;
  },
};
