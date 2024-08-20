import axios from "../../api/axios";

export const getall = async () => {
  try {
    const data = await axios.get("foods/getfoods");
    return data.data;
  } catch (err) {
    console.log(err);
  }
};

export const search = async (searchTerm) => {
  try {
    const data = await axios.get(`foods/filterbysearchterm/${searchTerm}`);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllTags = async () => {
  try {
    const data = await axios.get("foods/gettags");
    return data.data;
  } catch (err) {
    console.log(err);
  }
};

export const filterByTag = async (tag) => {
  try {
    const data = await axios.get(`foods/filterbytag/${tag}`);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};

export const getFoodById = async (id) => {
  try {
    const data = await axios.get(`foods/getfoodsbyid/${id}`);
    return data.data;
  } catch (err) {
    console.log(err);
  }
};
