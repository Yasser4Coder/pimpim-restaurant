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
import { Plus, Trash2, Upload, Loader2, AlertTriangle } from "lucide-react";
import galleryApi from "../../api/galleryApi";
import { toast } from "react-hot-toast";

// File validation constants
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  imageTitle,
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
                  Delete Image
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the image{" "}
                    <span className="font-medium text-gray-900">
                      "{imageTitle}"
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

const GalleryManagement = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    imageId: null,
    imageTitle: "",
  });

  const [newImage, setNewImage] = useState({
    title: "",
    description: "",
    image: null,
  });

  // Fetch gallery images on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await galleryApi.getAll();
      setGalleryImages(response.data);
    } catch (err) {
      setError("Failed to load gallery images. Please try again.");
      toast.error("Failed to load gallery images");
    } finally {
      setLoading(false);
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
        setNewImage({ ...newImage, image: file });
      } else {
        // Reset the file input
        e.target.value = "";
      }
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImage.image || !newImage.title) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", newImage.image);
      formData.append("title", newImage.title);
      formData.append("description", newImage.description);

      await galleryApi.upload(formData);
      toast.success("Image added successfully");
      await fetchGalleryImages();
      setNewImage({ title: "", description: "", image: null });
      setShowAddForm(false);
    } catch (err) {
      toast.error("Failed to add image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      setIsDeleting(true);
      await galleryApi.delete(id);
      toast.success("Image deleted successfully");
      await fetchGalleryImages();
    } catch (err) {
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation({ show: false, imageId: null, imageTitle: "" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
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
            onClick={fetchGalleryImages}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gallery Management
          </h1>
          <p className="text-gray-600">
            Manage your restaurant's photo gallery
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {/* Add Image Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <Label htmlFor="image-upload">Upload Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("image-upload").click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                  <span className="text-sm text-gray-500">
                    (Max size: 10MB, Allowed: JPG, PNG, JPEG, WEBP)
                  </span>
                </div>
              </div>

              {newImage.image && (
                <div>
                  <Label>Preview</Label>
                  <img
                    src={URL.createObjectURL(newImage.image)}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newImage.title}
                  onChange={(e) =>
                    setNewImage({ ...newImage, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newImage.description}
                  onChange={(e) =>
                    setNewImage({ ...newImage, description: e.target.value })
                  }
                />
              </div>

              <div className="flex space-x-2">
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
                    "Add Photo"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewImage({ title: "", description: "", image: null });
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.show}
        onClose={() =>
          setDeleteConfirmation({ show: false, imageId: null, imageTitle: "" })
        }
        onConfirm={() => handleDeleteImage(deleteConfirmation.imageId)}
        imageTitle={deleteConfirmation.imageTitle}
        isDeleting={isDeleting}
      />

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((image) => (
          <Card key={image._id} className="overflow-hidden group">
            <div className="relative">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setDeleteConfirmation({
                      show: true,
                      imageId: image._id,
                      imageTitle: image.title,
                    })
                  }
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
              <p className="text-gray-600 text-sm">{image.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {galleryImages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Upload className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start building your restaurant gallery by adding some photos.
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Photo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GalleryManagement;
