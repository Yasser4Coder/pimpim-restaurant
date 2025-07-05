/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import { Badge } from "../../components/ui/Badge";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Loader2,
  AlertTriangle,
  Search,
  X,
} from "lucide-react";
import menuApi from "../../api/menuApi";
import categoryApi from "../../api/categoryApi";
import { toast } from "react-hot-toast";

// File validation constants
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Error handling utility
const handleApiError = (error, defaultMessage) => {
  if (error.response) {
    // Server responded with an error
    const status = error.response.status;
    const message = error.response.data?.message || defaultMessage;

    switch (status) {
      case 400:
        toast.error("Invalid request. Please check your input.");
        break;
      case 401:
        toast.error("Unauthorized. Please log in again.");
        break;
      case 403:
        toast.error("You don't have permission to perform this action.");
        break;
      case 404:
        toast.error("The requested resource was not found.");
        break;
      case 413:
        toast.error("The file size is too large.");
        break;
      case 415:
        toast.error("Unsupported file type.");
        break;
      case 500:
        toast.error("Server error. Please try again later.");
        break;
      default:
        toast.error(message || defaultMessage);
    }
  } else if (error.request) {
    // Request was made but no response received
    toast.error("Network error. Please check your connection.");
  } else {
    // Something else happened
    toast.error(defaultMessage);
  }
  console.error("API Error:", error);
};

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Delete Menu Item
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-gray-900">
                      "{itemName}"
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="w-full sm:w-auto sm:ml-3 bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddCategoryDialog = ({ isOpen, onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(categoryName);
      setCategoryName("");
      onClose();
    } catch (error) {
      // Error is handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Add New Category
                </h3>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Category"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="mt-3 sm:mt-0 sm:mr-3"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteCategoryConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Delete Category
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the category{" "}
                    <span className="font-medium text-gray-900">
                      "{categoryName}"
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="w-full sm:w-auto sm:ml-3 bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    itemId: null,
    itemName: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    rating: "",
  });

  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [deleteCategoryConfirmation, setDeleteCategoryConfirmation] = useState({
    show: false,
    categoryId: null,
    categoryName: "",
  });

  // Update filtered items when search query or menu items change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(menuItems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, menuItems]);

  // Fetch menu items and categories on component mount
  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await menuApi.getAll();
      setMenuItems(response.data);
      setFilteredItems(response.data);
    } catch (err) {
      handleApiError(err, "Failed to fetch menu items");
      setError("Failed to load menu items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (err) {
      handleApiError(err, "Failed to fetch categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleAddCategory = async (name) => {
    try {
      await categoryApi.add({ name });
      toast.success("Category added successfully");
      await fetchCategories();
    } catch (err) {
      handleApiError(err, "Failed to add category");
      throw err; // Re-throw to handle in the dialog
    }
  };

  const validateFile = (file) => {
    if (!file) return true;

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a JPG, PNG, JPEG, or WEBP image."
      );
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size too large. Maximum size is 10MB.");
      return false;
    }

    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateFile(file)) {
        setFormData({ ...formData, image: file });
      } else {
        // Reset the file input
        e.target.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate image if it's a new upload
    if (formData.image && typeof formData.image === "object") {
      if (!validateFile(formData.image)) {
        return;
      }
    }

    // Validate rating
    const ratingValue = parseFloat(formData.rating);
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
      toast.error("Rating must be a number between 0 and 5.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("available", "true");
      formDataToSend.append("rating", ratingValue);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingItem) {
        await menuApi.update(editingItem._id, formDataToSend);
        toast.success("Menu item updated successfully");
      } else {
        await menuApi.add(formDataToSend);
        toast.success("Menu item added successfully");
      }

      await fetchMenuItems();
      resetForm();
    } catch (err) {
      handleApiError(
        err,
        editingItem ? "Failed to update menu item" : "Failed to add menu item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: null,
      rating: item.rating !== undefined ? item.rating.toString() : "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      await menuApi.delete(id);
      toast.success("Menu item deleted successfully");
      await fetchMenuItems();
    } catch (err) {
      handleApiError(err, "Failed to delete menu item");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation({ show: false, itemId: null, itemName: "" });
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append("available", (!currentStatus).toString());
      await menuApi.update(id, formData);
      toast.success("Availability updated successfully");
      await fetchMenuItems();
    } catch (err) {
      handleApiError(err, "Failed to update availability");
    }
  };

  const getImageUrl = (item) => {
    if (item.image) {
      if (typeof item.image === "string") {
        return item.image;
      }
      return URL.createObjectURL(item.image);
    }
    return "/placeholder.svg";
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
      rating: "",
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString("ar-DZ")} DZD`;
  };

  const handleDeleteCategory = async (id) => {
    try {
      setIsDeletingCategory(true);
      await categoryApi.delete(id);
      toast.success("Category deleted successfully");
      await fetchCategories();
    } catch (err) {
      handleApiError(err, "Failed to delete category");
    } finally {
      setIsDeletingCategory(false);
      setDeleteCategoryConfirmation({
        show: false,
        categoryId: null,
        categoryName: "",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant menu items</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by name, category, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.show}
        onClose={() =>
          setDeleteConfirmation({ show: false, itemId: null, itemName: "" })
        }
        onConfirm={() => handleDelete(deleteConfirmation.itemId)}
        itemName={deleteConfirmation.itemName}
        isDeleting={isDeleting}
      />

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (DZD)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <div className="flex space-x-2">
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddCategory(true)}
                      className="whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New
                    </Button>
                  </div>
                  <div className="mt-2">
                    <div className="relative">
                      <div className="max-h-[120px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {categories.map((cat) => (
                          <div
                            key={cat._id}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-sm">{cat.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteCategoryConfirmation({
                                  show: true,
                                  categoryId: cat._id,
                                  categoryName: cat.name,
                                })
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {categories.length > 3 && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      )}
                    </div>
                    {categories.length > 3 && (
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Scroll to see more categories
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="image">Image</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image").click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    <span className="text-sm text-gray-500">
                      (Max size: 10MB, Allowed: JPG, PNG, JPEG, WEBP)
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>
              {formData.image && (
                <div>
                  <Label>Preview</Label>
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingItem ? "Updating..." : "Adding..."}
                    </>
                  ) : editingItem ? (
                    "Update Item"
                  ) : (
                    "Add Item"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Category Dialog */}
      <AddCategoryDialog
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onAdd={handleAddCategory}
      />

      {/* Delete Category Confirmation Dialog */}
      <DeleteCategoryConfirmationDialog
        isOpen={deleteCategoryConfirmation.show}
        onClose={() =>
          setDeleteCategoryConfirmation({
            show: false,
            categoryId: null,
            categoryName: "",
          })
        }
        onConfirm={() =>
          handleDeleteCategory(deleteCategoryConfirmation.categoryId)
        }
        categoryName={deleteCategoryConfirmation.categoryName}
        isDeleting={isDeletingCategory}
      />

      {/* Menu Items Grid */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500" />
          <p className="mt-2 text-gray-600">Loading menu items...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : filteredItems.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              {searchQuery ? "No matching items found" : "No Menu Items Found"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start by adding your first menu item using the button above."}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Menu Item
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    item.available ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <span className="text-lg font-bold text-orange-600">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <Badge variant="outline">{item.category}</Badge>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleAvailability(item._id, item.available)
                      }
                    >
                      {item.available ? "Mark Unavailable" : "Mark Available"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDeleteConfirmation({
                          show: true,
                          itemId: item._id,
                          itemName: item.name,
                        })
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-red-600 hover:text-red-700"
              onClick={fetchMenuItems}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuManagement;
