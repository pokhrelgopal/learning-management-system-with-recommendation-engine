"use client";
import { mediaUrl } from "@/app/endpoints";
import { updateUser } from "@/app/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUser from "@/hooks/useUser";
import showToast from "@/lib/toaster";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { ImageUp } from "lucide-react";
import Image from "next/image";
import React from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = React.useState("personal-details");
  const active = "bg-white text-indigo-600";
  return (
    <div className="mt-5">
      <div className="flex gap-10">
        <div className="bg-gray-100 min-w-80 p-4 rounded-xl h-fit">
          <ul className="space-y-3">
            <li
              onClick={() => setActiveTab("personal-details")}
              className={`cursor-pointer p-3 rounded-xl text-gray-600 ${
                activeTab === "personal-details" ? active : ""
              }`}
            >
              Personal Details
            </li>
            <li
              onClick={() => setActiveTab("change-password")}
              className={`cursor-pointer p-3 rounded-xl text-gray-600 ${
                activeTab === "change-password" ? active : ""
              }`}
            >
              Change password
            </li>
          </ul>
        </div>
        <div className="w-full">
          {activeTab === "personal-details" && <PersonalDetails />}
          {activeTab === "change-password" && <ChangePassword />}
        </div>
      </div>
    </div>
  );
};

export default Profile;

const ChangePassword = () => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [updating, setUpdating] = React.useState(false);
  const { user, isLoading } = useUser();
  const updatePassword = async () => {
    if (password.trim() !== confirmPassword.trim()) {
      showToast("error", "Passwords do not match");
      return;
    }
    if (password.trim().length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }

    try {
      if (!user) return;
      setUpdating(true);
      const res = await updateUser(user?.id, { password });
      if (res.status === 200) {
        showToast("success", "Password updated successfully");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      showToast("error", "An error occurred while updating password.");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <div className="w-1/2">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-3">
          <Label className="text-lg" htmlFor="current-password">
            New Password
          </Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="mt-1"
          />
        </div>
        <div className="mb-3">
          <Label className="text-lg" htmlFor="current-password">
            Confirm Password
          </Label>
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            className="mt-1"
          />
        </div>
        <div className="mb-3">
          <Button loading={updating || isLoading} onClick={updatePassword}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

const PersonalDetails = () => {
  const [updating, setUpdating] = React.useState(false);
  const { user, isLoading } = useUser();
  const [fullName, setFullName] = React.useState(user?.full_name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [profile, setProfile] = React.useState(mediaUrl + user?.profile_image);
  const [profileFile, setProfileFile] = React.useState<File | null>(null);

  const queryClient = useQueryClient();
  React.useEffect(() => {
    setFullName(user?.full_name || "");
    setEmail(user?.email || "");
  }, [user]);

  const updateDetails = async () => {
    if (!fullName || !email) {
      showToast("error", "Fields are empty.");
      return;
    }

    if (!/^[a-zA-Z ]+$/.test(fullName)) {
      showToast("error", "Full name should only have alphabets and spaces.");
      return;
    }
    if (!/^[a-zA-Z ]+$/.test(fullName)) {
      showToast("error", "Full name should only have alphabets and spaces.");
      return;
    }
    if (email !== user?.email && !/^\S+@\S+\.\S+$/.test(email)) {
      showToast("error", "Invalid email address.");
      return;
    }
    if (fullName.trim().length < 3) {
      showToast("error", "Full name must be at least 3 characters");
      return;
    }
    try {
      setUpdating(true);
      const payload = new FormData();
      payload.append("full_name", fullName);
      payload.append("email", email);
      if (profileFile) {
        payload.append("profile_image", profileFile);
      }
      if (!user) return;
      const res = await updateUser(user?.id, payload);
      if (res.status === 200) {
        showToast("success", "Details updated successfully");
        queryClient.invalidateQueries("me" as InvalidateQueryFilters);
      }
    } catch (error: any) {
      if (error.response?.data?.email) {
        showToast("error", error.response.data.email[0]);
        return;
      }
      showToast("error", "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileFile(e.target.files[0]);
      setProfile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImageClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput) return;
    fileInput.click();
  };
  return (
    <div className="w-1/2">
      <h2 className="text-2xl font-bold mb-6">Update Details</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="relative mb-6 flex justify-center">
          <Image
            src={profile}
            alt="Profile Image"
            width={500}
            height={500}
            className="rounded-full h-32 w-32 object-cover"
          />
          <span className="absolute bottom-0 right-48 cursor-pointer bg-green-500 rounded-full">
            <ImageUp
              onClick={handleImageClick}
              size={24}
              className="text-white p-1"
            />
          </span>
          <Input
            id="fileInput"
            type="file"
            className="mt-3 hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-3">
          <Label className="text-lg" htmlFor="current-password">
            Full Name
          </Label>
          <Input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="mt-1 text-lg"
          />
        </div>
        <div className="mb-3">
          <Label className="text-lg" htmlFor="current-password">
            Email Address
          </Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="mt-1 text-lg"
          />
        </div>
        <div className="mb-3">
          <Button loading={updating || isLoading} onClick={updateDetails}>
            Update Details
          </Button>
        </div>
      </form>
    </div>
  );
};
