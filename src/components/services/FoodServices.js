import menuApi from "../../api/menuApi";
import categoryApi from "../../api/categoryApi";

export const getall = async () => {
  try {
    const response = await menuApi.getAll();
    // Filter to show only available items
    const availableItems = response.data.filter(
      (item) => item.available !== false
    );
    return availableItems;
  } catch (err) {
    console.error("Error fetching menu items:", err);
    return [];
  }
};

export const search = async (searchTerm) => {
  try {
    const response = await menuApi.getAll();
    const allItems = response.data;

    // Filter items by search term (name, description, or category) and availability
    const filteredItems = allItems.filter(
      (item) =>
        item.available !== false &&
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filteredItems;
  } catch (err) {
    console.error("Error searching menu items:", err);
    return [];
  }
};

export const getAllTags = async () => {
  try {
    const [categoriesResponse, menuResponse] = await Promise.all([
      categoryApi.getAll(),
      menuApi.getAll(),
    ]);

    const categories = categoriesResponse.data;
    const allMenuItems = menuResponse.data;

    // Filter to only available menu items
    const availableMenuItems = allMenuItems.filter(
      (item) => item.available !== false
    );

    // Create category objects with count (only for available items)
    const categoryCounts = categories.map((category) => {
      const count = availableMenuItems.filter(
        (item) => item.category.toLowerCase() === category.name.toLowerCase()
      ).length;

      return {
        name: category.name,
        count: count,
      };
    });

    // Add "All" category at the beginning (only available items)
    return [
      { name: "All", count: availableMenuItems.length },
      ...categoryCounts,
    ];
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [{ name: "All", count: 0 }];
  }
};

export const filterByTag = async (tag) => {
  try {
    const response = await menuApi.getAll();
    const allItems = response.data;

    // Filter items by category (tag) and availability
    const filteredItems = allItems.filter(
      (item) =>
        item.available !== false &&
        item.category.toLowerCase() === tag.toLowerCase()
    );

    return filteredItems;
  } catch (err) {
    console.error("Error filtering by tag:", err);
    return [];
  }
};

export const getFoodById = async (id) => {
  try {
    // First, let's try to get all items and find the one we need
    const allResponse = await menuApi.getAll();
    const allItems = allResponse.data;
    const food = allItems.find((item) => item._id === id);

    if (food) {
      // Check if the food is available
      if (food.available !== false) {
        return food;
      } else {
        return null;
      }
    } else {
      // Fallback to direct API call
      try {
        const response = await menuApi.getById(id);
        const directFood = response.data;

        if (directFood && directFood.available !== false) {
          return directFood;
        } else {
          return null;
        }
      } catch (directErr) {
        return null;
      }
    }
  } catch (err) {
    return null;
  }
};
