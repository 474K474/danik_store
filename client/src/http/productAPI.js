import { $authHost } from './index';

export const fetchProductById = async (id) => {
  const { data } = await $authHost.get(`/api/product/${id}`);
  return data;
};

