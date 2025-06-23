import React from "react";
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
import { Switch } from "../../components/ui/Switch";
import {
  Upload,
  Save,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Loader2,
  Trash2,
  Image,
  Instagram,
} from "lucide-react";
import settingsApi from "../../api/settingsApi";
import { toast } from "react-hot-toast";

// File validation constants
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const Settings = () => {
  const [restaurantSettings, setRestaurantSettings] = useState({
    // Restaurant Status
    isOpen: true,

    // Restaurant Information
    name: "Delicious Bites Restaurant",
    coverImage: "/placeholder.svg?height=400&width=800",
    description:
      "Welcome to Delicious Bites, where culinary excellence meets warm hospitality. Since 2010, we've been serving the finest dishes made from fresh, locally-sourced ingredients. Our passionate chefs create memorable dining experiences that bring families and friends together around exceptional food.",
    story:
      "Founded by Chef Maria Rodriguez in 2010, Delicious Bites started as a small family kitchen with big dreams. What began as a passion for sharing authentic flavors has grown into a beloved community gathering place. Every dish tells a story of tradition, innovation, and love for great food.",
    logo: "",

    // Owner Information
    owner: {
      name: "Maria Rodriguez",
      photo: "/placeholder.svg?height=200&width=200",
      bio: "With over 20 years of culinary experience, I believe that food is more than sustenance—it's a way to connect hearts and create lasting memories. Every dish that leaves our kitchen carries a piece of my passion and dedication to excellence.",
      title: "Head Chef & Owner",
    },

    // Contact Information
    contact: {
      phone: "+1 (555) 123-4567",
      email: "info@deliciousbites.com",
      website: "www.deliciousbites.com",
      address: "123 Culinary Street, Food District, City 12345",
      supportPhone: "",
    },

    // Operating Hours
    hours: {
      monday: { open: "11:00", close: "22:00", closed: false },
      tuesday: { open: "11:00", close: "22:00", closed: false },
      wednesday: { open: "11:00", close: "22:00", closed: false },
      thursday: { open: "11:00", close: "22:00", closed: false },
      friday: { open: "11:00", close: "23:00", closed: false },
      saturday: { open: "10:00", close: "23:00", closed: false },
      sunday: { open: "10:00", close: "21:00", closed: false },
    },

    // Landing Page
    landingPage: {
      heroSection: {
        images: [],
        title: "Welcome to Our Restaurant",
        subtitle: "Experience the finest dining in town",
        description: "Discover our amazing menu and exceptional service",
      },
      instagramGallery: {
        selectedImages: [],
        title: "Instagram Gallery",
        subtitle: "Follow us on Instagram",
        maxImages: 6,
      },
    },
  });

  const [activeSection, setActiveSection] = useState("restaurant");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingOwnerPhoto, setIsUploadingOwnerPhoto] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // Error handling utility
  const handleApiError = (error, defaultMessage) => {
    if (error.response) {
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
          toast.error("Settings not found.");
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
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(defaultMessage);
    }
    console.error("API Error:", error);
  };

  // File validation utility
  const validateFile = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(
        "Please select a valid image file (JPEG, PNG, JPG, or WebP)."
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10MB.");
      return false;
    }

    return true;
  };

  // Fetch settings from backend
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await settingsApi.get();
      setRestaurantSettings(response.data);
    } catch (error) {
      handleApiError(error, "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch gallery images for Instagram gallery selection
  const fetchGalleryImages = async () => {
    try {
      setIsLoadingGallery(true);
      const response = await settingsApi.getGalleryImages();
      setGalleryImages(response.data);
    } catch (error) {
      handleApiError(error, "Failed to load gallery images");
    } finally {
      setIsLoadingGallery(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
    fetchGalleryImages();
  }, []);

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setIsUploadingCover(true);
      const response = await settingsApi.uploadCoverImage(file);

      setRestaurantSettings((prev) => ({
        ...prev,
        coverImage: response.data.coverImage,
      }));

      toast.success("Cover image uploaded successfully!");
    } catch (error) {
      handleApiError(error, "Failed to upload cover image");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleOwnerPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setIsUploadingOwnerPhoto(true);
      const response = await settingsApi.uploadOwnerPhoto(file);

      setRestaurantSettings((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          photo: response.data.ownerPhoto,
        },
      }));

      toast.success("Owner photo uploaded successfully!");
    } catch (error) {
      handleApiError(error, "Failed to upload owner photo");
    } finally {
      setIsUploadingOwnerPhoto(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setIsUploadingLogo(true);
      const response = await settingsApi.uploadLogo(file);

      setRestaurantSettings((prev) => ({
        ...prev,
        logo: response.data.logo,
      }));

      toast.success("Logo uploaded successfully!");
    } catch (error) {
      handleApiError(error, "Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleHeroImagesUpdate = async (galleryData) => {
    try {
      const response = await settingsApi.updateHeroImages(galleryData);

      setRestaurantSettings((prev) => ({
        ...prev,
        landingPage: {
          ...prev.landingPage,
          heroSection: {
            ...prev.landingPage.heroSection,
            images: response.data.heroImages,
          },
        },
      }));

      toast.success("Hero images updated successfully!");
    } catch (error) {
      handleApiError(error, "Failed to update hero images");
    }
  };

  const handleRemoveHeroImage = async (index) => {
    try {
      const response = await settingsApi.removeHeroImage(index);

      setRestaurantSettings((prev) => ({
        ...prev,
        landingPage: {
          ...prev.landingPage,
          heroSection: {
            ...prev.landingPage.heroSection,
            images: response.data.heroImages,
          },
        },
      }));

      toast.success("Hero image removed successfully!");
    } catch (error) {
      handleApiError(error, "Failed to remove hero image");
    }
  };

  const handleInstagramGalleryUpdate = async (galleryData) => {
    try {
      const response = await settingsApi.updateInstagramGallery(galleryData);

      setRestaurantSettings((prev) => ({
        ...prev,
        landingPage: {
          ...prev.landingPage,
          instagramGallery: response.data.instagramGallery,
        },
      }));

      toast.success("Instagram gallery updated successfully!");
    } catch (error) {
      handleApiError(error, "Failed to update Instagram gallery");
    }
  };

  const handleInputChange =
    (field, subField = null, subSubField = null) =>
    (e) => {
      const value = e.target.value;
      if (subField && subSubField) {
        // Handle deeply nested objects like landingPage.heroSection.title
        setRestaurantSettings((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: {
              ...prev[field]?.[subField],
              [subSubField]: value,
            },
          },
        }));
      } else if (subField) {
        // Handle nested objects like owner.name
        setRestaurantSettings((prev) => ({
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: value,
          },
        }));
      } else {
        // Handle top-level fields
        setRestaurantSettings((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    };

  const handleHoursChange = (day, field, value) => {
    setRestaurantSettings((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await settingsApi.update(restaurantSettings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      handleApiError(error, "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusToggle = async (isOpen) => {
    try {
      await settingsApi.updateStatus(isOpen);
      setRestaurantSettings((prev) => ({
        ...prev,
        isOpen,
      }));
      toast.success(`Restaurant is now ${isOpen ? "open" : "closed"}`);
    } catch (error) {
      handleApiError(error, "Failed to update restaurant status");
    }
  };

  const sections = [
    { id: "restaurant", label: "Restaurant Info" },
    { id: "owner", label: "Owner Info" },
    { id: "contact", label: "Contact & Hours" },
    { id: "landing", label: "Landing Page" },
    { id: "status", label: "Status & Operations" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Restaurant Settings
          </h1>
          <p className="text-gray-600">
            Manage your restaurant information and settings
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-orange-500 hover:bg-orange-600"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="flex space-x-6">
        {/* Settings Navigation */}
        <div className="w-64">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === section.id
                        ? "bg-orange-100 text-orange-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeSection === "restaurant" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Restaurant Logo</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                          {restaurantSettings.logo ? (
                            <img
                              src={restaurantSettings.logo}
                              alt="Restaurant Logo"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <div className="text-2xl mb-1">🏪</div>
                              <div className="text-xs">No Logo</div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                            disabled={isUploadingLogo}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("logo-upload").click()
                            }
                            disabled={isUploadingLogo}
                          >
                            {isUploadingLogo ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                {restaurantSettings.logo
                                  ? "Change Logo"
                                  : "Upload Logo"}
                              </>
                            )}
                          </Button>
                          {restaurantSettings.logo && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setRestaurantSettings((prev) => ({
                                  ...prev,
                                  logo: "",
                                }));
                                toast.success("Logo removed!");
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Upload your restaurant logo. Recommended size:
                        200x200px, max 2MB.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="restaurant-name">Restaurant Name</Label>
                    <Input
                      id="restaurant-name"
                      value={restaurantSettings.name}
                      onChange={handleInputChange("name")}
                    />
                  </div>

                  <div>
                    <Label>Cover Image</Label>
                    <div className="space-y-2">
                      <img
                        src={
                          restaurantSettings.coverImage || "/placeholder.svg"
                        }
                        alt="Restaurant Cover"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          className="hidden"
                          id="cover-upload"
                          disabled={isUploadingCover}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("cover-upload").click()
                          }
                          disabled={isUploadingCover}
                        >
                          {isUploadingCover ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Change Cover
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Restaurant Description</Label>
                    <Textarea
                      id="description"
                      value={restaurantSettings.description}
                      onChange={handleInputChange("description")}
                      rows={4}
                      placeholder="Describe your restaurant..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="story">Restaurant Story</Label>
                    <Textarea
                      id="story"
                      value={restaurantSettings.story}
                      onChange={handleInputChange("story")}
                      rows={4}
                      placeholder="Tell your restaurant's story..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "owner" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Owner Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="owner-name">Owner Name</Label>
                      <Input
                        id="owner-name"
                        value={restaurantSettings.owner.name}
                        onChange={handleInputChange("owner", "name")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="owner-title">Title</Label>
                      <Input
                        id="owner-title"
                        value={restaurantSettings.owner.title}
                        onChange={handleInputChange("owner", "title")}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Owner Photo</Label>
                    <div className="space-y-2">
                      <img
                        src={
                          restaurantSettings.owner.photo || "/placeholder.svg"
                        }
                        alt="Owner"
                        className="w-32 h-32 object-cover rounded-full border"
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleOwnerPhotoUpload}
                          className="hidden"
                          id="owner-photo-upload"
                          disabled={isUploadingOwnerPhoto}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById("owner-photo-upload")
                              .click()
                          }
                          disabled={isUploadingOwnerPhoto}
                        >
                          {isUploadingOwnerPhoto ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Change Photo
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="owner-bio">Owner's Message</Label>
                    <Textarea
                      id="owner-bio"
                      value={restaurantSettings.owner.bio}
                      onChange={handleInputChange("owner", "bio")}
                      rows={4}
                      placeholder="Share your message with customers..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "contact" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={restaurantSettings.contact.phone}
                          onChange={handleInputChange("contact", "phone")}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="support-phone">
                        Support Phone (Help Number)
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="support-phone"
                          value={restaurantSettings.contact.supportPhone || ""}
                          onChange={handleInputChange(
                            "contact",
                            "supportPhone"
                          )}
                          className="pl-10"
                          placeholder="Enter support/help phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          value={restaurantSettings.contact.email}
                          onChange={handleInputChange("contact", "email")}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          value={restaurantSettings.contact.website}
                          onChange={handleInputChange("contact", "website")}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="address"
                        value={restaurantSettings.contact.address}
                        onChange={handleInputChange("contact", "address")}
                        className="pl-10"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operating Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(restaurantSettings.hours).map(
                      ([day, hours]) => (
                        <div
                          key={day}
                          className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
                            !hours.closed
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-24">
                              <span className="font-medium capitalize">
                                {day}
                              </span>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-3">
                                <Switch
                                  checked={!hours.closed}
                                  onCheckedChange={(checked) =>
                                    handleHoursChange(day, "closed", !checked)
                                  }
                                  className={`${
                                    !hours.closed
                                      ? "data-[state=checked]:bg-green-600"
                                      : "data-[state=unchecked]:bg-red-400"
                                  }`}
                                />
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      !hours.closed
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {!hours.closed ? "🟢 Open" : "🔴 Closed"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {!hours.closed && (
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <Input
                                  type="time"
                                  value={hours.open}
                                  onChange={(e) =>
                                    handleHoursChange(
                                      day,
                                      "open",
                                      e.target.value
                                    )
                                  }
                                  className="w-28 border-0 focus:ring-0 p-0 text-sm"
                                />
                                <span className="text-gray-500 text-sm">
                                  to
                                </span>
                                <Input
                                  type="time"
                                  value={hours.close}
                                  onChange={(e) =>
                                    handleHoursChange(
                                      day,
                                      "close",
                                      e.target.value
                                    )
                                  }
                                  className="w-28 border-0 focus:ring-0 p-0 text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">💡</span>
                      </div>
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-2">
                          How to manage operating hours:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>
                              <strong>Green toggle</strong> = Restaurant is open
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>
                              <strong>Red toggle</strong> = Restaurant is closed
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>
                              <strong>Time inputs</strong> = Set opening/closing
                              times
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>
                              <strong>Visual feedback</strong> = Background
                              color shows status
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "landing" && (
            <div className="space-y-6">
              {/* Hero Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="h-5 w-5" />
                    <span>Hero Section</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hero-title">Hero Section Title</Label>
                    <Input
                      id="hero-title"
                      value={
                        restaurantSettings.landingPage?.heroSection?.title || ""
                      }
                      onChange={handleInputChange(
                        "landingPage",
                        "heroSection",
                        "title"
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hero-subtitle">Hero Section Subtitle</Label>
                    <Input
                      id="hero-subtitle"
                      value={
                        restaurantSettings.landingPage?.heroSection?.subtitle ||
                        ""
                      }
                      onChange={handleInputChange(
                        "landingPage",
                        "heroSection",
                        "subtitle"
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hero-description">
                      Hero Section Description
                    </Label>
                    <Textarea
                      id="hero-description"
                      value={
                        restaurantSettings.landingPage?.heroSection
                          ?.description || ""
                      }
                      onChange={handleInputChange(
                        "landingPage",
                        "heroSection",
                        "description"
                      )}
                      rows={4}
                      placeholder="Describe the hero section..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={async () => {
                        try {
                          await settingsApi.updateHeroContent({
                            title:
                              restaurantSettings.landingPage?.heroSection
                                ?.title || "",
                            subtitle:
                              restaurantSettings.landingPage?.heroSection
                                ?.subtitle || "",
                            description:
                              restaurantSettings.landingPage?.heroSection
                                ?.description || "",
                          });
                          toast.success("Hero content saved successfully!");
                        } catch (error) {
                          handleApiError(error, "Failed to save hero content");
                        }
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Hero Content
                    </Button>
                  </div>

                  <div>
                    <Label>Hero Images</Label>
                    <div className="space-y-2">
                      {(
                        restaurantSettings.landingPage?.heroSection?.images ||
                        []
                      ).map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-3 border rounded-lg"
                        >
                          <img
                            src={image}
                            alt={`Hero Image ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Hero Image {index + 1}
                            </p>
                            <p className="text-xs text-gray-500">
                              Selected from gallery
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveHeroImage(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {(
                        restaurantSettings.landingPage?.heroSection?.images ||
                        []
                      ).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Image className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No hero images selected yet</p>
                          <p className="text-sm">
                            Select images from the gallery below
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Select Hero Images from Gallery</Label>
                    {isLoadingGallery ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-500">
                          Loading gallery images...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="overflow-x-auto max-w-[55vw]">
                            <div className="flex space-x-4 pb-2 min-w-max">
                              {galleryImages.map((image) => {
                                const isSelected = (
                                  restaurantSettings.landingPage?.heroSection
                                    ?.images || []
                                ).includes(image.url);
                                return (
                                  <div
                                    key={image._id}
                                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                                      isSelected
                                        ? "border-orange-500 bg-orange-50"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    style={{
                                      width: "180px",
                                      minWidth: "180px",
                                    }}
                                    onClick={() => {
                                      const currentSelected =
                                        restaurantSettings.landingPage
                                          ?.heroSection?.images || [];
                                      const newSelected = isSelected
                                        ? currentSelected.filter(
                                            (url) => url !== image.url
                                          )
                                        : [...currentSelected, image.url];

                                      handleHeroImagesUpdate({
                                        images: newSelected,
                                      });
                                    }}
                                  >
                                    <img
                                      src={image.url}
                                      alt={image.title}
                                      className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                      {isSelected && (
                                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                          <span className="text-white text-xs">
                                            ✓
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="p-2 bg-white">
                                      <p className="text-xs font-medium truncate">
                                        {image.title}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {galleryImages.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Image className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                              <p>No gallery images available</p>
                              <p className="text-sm">
                                Upload images in the Gallery section first
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Scroll horizontally to see all images. Click to
                          select/deselect for hero section.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Instagram Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Instagram className="h-5 w-5" />
                    <span>Instagram Gallery</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="instagram-title">Gallery Title</Label>
                    <Input
                      id="instagram-title"
                      value={
                        restaurantSettings.landingPage?.instagramGallery
                          ?.title || ""
                      }
                      onChange={handleInputChange(
                        "landingPage",
                        "instagramGallery",
                        "title"
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram-subtitle">Gallery Subtitle</Label>
                    <Input
                      id="instagram-subtitle"
                      value={
                        restaurantSettings.landingPage?.instagramGallery
                          ?.subtitle || ""
                      }
                      onChange={handleInputChange(
                        "landingPage",
                        "instagramGallery",
                        "subtitle"
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="max-images">
                      Maximum Images to Display
                    </Label>
                    <Input
                      id="max-images"
                      type="number"
                      min="1"
                      max="12"
                      value={
                        restaurantSettings.landingPage?.instagramGallery
                          ?.maxImages || 6
                      }
                      onChange={handleInputChange(
                        "landingPage",
                        "instagramGallery",
                        "maxImages"
                      )}
                      className="w-32"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={async () => {
                        try {
                          await settingsApi.updateInstagramGallery({
                            title:
                              restaurantSettings.landingPage?.instagramGallery
                                ?.title || "",
                            subtitle:
                              restaurantSettings.landingPage?.instagramGallery
                                ?.subtitle || "",
                            maxImages:
                              restaurantSettings.landingPage?.instagramGallery
                                ?.maxImages || 6,
                          });
                          toast.success(
                            "Instagram gallery content saved successfully!"
                          );
                        } catch (error) {
                          handleApiError(
                            error,
                            "Failed to save Instagram gallery content"
                          );
                        }
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Gallery Content
                    </Button>
                  </div>

                  <div>
                    <Label>Select Gallery Images</Label>
                    {isLoadingGallery ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-500">
                          Loading gallery images...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="overflow-x-auto max-w-[55vw]">
                            <div className="flex space-x-4 pb-2 min-w-max">
                              {galleryImages.map((image) => {
                                const isSelected = (
                                  restaurantSettings.landingPage
                                    ?.instagramGallery?.selectedImages || []
                                ).includes(image._id);
                                return (
                                  <div
                                    key={image._id}
                                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                                      isSelected
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    style={{
                                      width: "180px",
                                      minWidth: "180px",
                                    }}
                                    onClick={() => {
                                      const currentSelected =
                                        restaurantSettings.landingPage
                                          ?.instagramGallery?.selectedImages ||
                                        [];
                                      const newSelected = isSelected
                                        ? currentSelected.filter(
                                            (id) => id !== image._id
                                          )
                                        : [...currentSelected, image._id];

                                      handleInstagramGalleryUpdate({
                                        selectedImages: newSelected,
                                      });
                                    }}
                                  >
                                    <img
                                      src={image.url}
                                      alt={image.title}
                                      className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                      {isSelected && (
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                          <span className="text-white text-xs">
                                            ✓
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="p-2 bg-white">
                                      <p className="text-xs font-medium truncate">
                                        {image.title}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {galleryImages.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Instagram className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                              <p>No gallery images available</p>
                              <p className="text-sm">
                                Upload images in the Gallery section first
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Scroll horizontally to see all images. Click to
                          select/deselect for Instagram gallery.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "status" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Status Control */}
                  <div
                    className={`flex items-center justify-between p-6 border-2 rounded-xl transition-all duration-300 ${
                      restaurantSettings.isOpen
                        ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50"
                        : "border-red-300 bg-gradient-to-r from-red-50 to-pink-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          restaurantSettings.isOpen
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {restaurantSettings.isOpen ? (
                          <span className="text-2xl">🟢</span>
                        ) : (
                          <span className="text-2xl">🔴</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Restaurant Status
                        </h3>
                        <p className="text-sm text-gray-600">
                          Control whether your restaurant is accepting orders
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${
                            restaurantSettings.isOpen
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {restaurantSettings.isOpen ? "🟢 OPEN" : "🔴 CLOSED"}
                        </span>
                      </div>
                      <Switch
                        checked={restaurantSettings.isOpen}
                        onCheckedChange={handleStatusToggle}
                        className={`${
                          restaurantSettings.isOpen
                            ? "data-[state=checked]:bg-green-600"
                            : "data-[state=unchecked]:bg-red-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Status Information */}
                  <div
                    className={`p-5 rounded-xl border ${
                      restaurantSettings.isOpen
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          restaurantSettings.isOpen
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        <span className="text-white text-xs">ℹ️</span>
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold mb-3 ${
                            restaurantSettings.isOpen
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          Current Status:{" "}
                          {restaurantSettings.isOpen ? "OPEN" : "CLOSED"}
                        </h4>
                        <div className="space-y-2 text-sm">
                          {restaurantSettings.isOpen ? (
                            <>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-700">
                                  ✅ Customers can place orders
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-700">
                                  ✅ Restaurant appears as available
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-700">
                                  ✅ All ordering features are active
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-red-700">
                                  ❌ New orders are disabled
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-red-700">
                                  ❌ Restaurant appears as closed
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-red-700">
                                  ❌ Only existing orders can be managed
                                </span>
                              </div>
                            </>
                          )}
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-xs text-gray-600">
                              💡 <strong>Note:</strong> This setting overrides
                              your operating hours for immediate control
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card
                      className={`border-2 ${
                        restaurantSettings.isOpen
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`text-3xl font-bold mb-2 ${
                            restaurantSettings.isOpen
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {restaurantSettings.isOpen ? "🟢 OPEN" : "🔴 CLOSED"}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Current Status
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {restaurantSettings.isOpen
                            ? "Accepting orders"
                            : "Not accepting orders"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-blue-200 bg-blue-50">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          24
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Orders Today
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Total orders received
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-200 bg-orange-50">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          3
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Pending Orders
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Awaiting completion
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <h4 className="font-semibold mb-3 text-gray-900">
                      Quick Actions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleStatusToggle(true)}
                        disabled={restaurantSettings.isOpen}
                        className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                          restaurantSettings.isOpen
                            ? "border-green-300 bg-green-100 text-green-700 cursor-not-allowed"
                            : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-400"
                        }`}
                      >
                        <span className="text-lg">🟢</span>
                        <span className="font-medium">Open Restaurant</span>
                      </button>

                      <button
                        onClick={() => handleStatusToggle(false)}
                        disabled={!restaurantSettings.isOpen}
                        className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                          !restaurantSettings.isOpen
                            ? "border-red-300 bg-red-100 text-red-700 cursor-not-allowed"
                            : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400"
                        }`}
                      >
                        <span className="text-lg">🔴</span>
                        <span className="font-medium">Close Restaurant</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
