"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Save, Eye, EyeOff, Settings, AtSign } from "lucide-react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { updateUser } from "@/utils/db";
import { handleUpdateUser } from "../actions/auth";
import toast from "react-hot-toast";

/**
 * Settings Page Component
 *
 * Allows users to update their personal information and change password
 * Features:
 * - Personal info form (name, email)
 * - Password change form with validation
 * - Real-time form validation
 * - Success/error feedback
 * - Secure password requirements
 */
export default function SettingsPage() {
  const { data: session, update } = useSession();
  //   if (!session?.user) redirect("/auth/signin");

  // User profile state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Personal info form state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const router = useRouter();

  /**
   * Load user profile data on component mount
   */
  useEffect(() => {
    loadUserProfile();
  }, []);

  /**
   * Fetch user profile from API
   */
  const loadUserProfile = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "GET",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setPersonalInfo({
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          username: userData.username || "",
        });
      } else {
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      router.push("/auth/signin");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle personal info form input changes
   */
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Handle password form input changes
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Toggle password visibility for specific field
   */
  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  /**
   * Validate personal info form
   */
  const validatePersonalInfo = (): boolean => {
    if (!personalInfo.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }

    if (!personalInfo.username.trim()) {
      toast.error("Username is required");
      return false;
    }

    return true;
  };

  /**
   * Validate password form
   */
  const validatePasswordForm = (): boolean => {
    if (!passwordForm.currentPassword) {
      toast.error("Current password is required");
      return false;
    }

    if (!passwordForm.newPassword) {
      toast.error("New password is required");
      return false;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return false;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error("New password must be different from current password");
      return false;
    }

    return true;
  };

  /**
   * Handle personal info form submission
   */
  const handleUpdateProfile = async (formatData: FormData) => {
    if (!validatePersonalInfo()) return;

    setIsUpdatingProfile(true);

    try {
      const updatedUser = await handleUpdateUser(formatData, user);

      if (!updateUser) throw new Error();

      toast.success("Profile updated successfully!");

      // Update local user state
      setUser(updatedUser as any);

      // Update session data
      await update({
        ...session,
        user: {
          ...session?.user,
          first_name: personalInfo.firstName.trim(),
          last_name: personalInfo.lastName.trim(),
          username: personalInfo.username.trim().toLowerCase(),
        },
      });
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  /**
   * Handle password change form submission
   */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsUpdatingPassword(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local user state
        setUser(data);

        // Update session data (optional)
        // await update({
        //   ...session,
        //   user: {
        //     ...session?.user,
        //     first_name: personalInfo.firstName.trim(),
        //     last_name: personalInfo.lastName.trim(),
        //     username: personalInfo.username.trim().toLowerCase(),
        //   },
        // });

        toast.success("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Account Overview */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email Address</p>
                  <p className="text-white font-mono">{user?.email}</p>
                </div>
                {user?.created_at && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Member Since</p>
                    <p className="text-white">
                      {user?.created_at ? formatDate(user.created_at) : "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleUpdateProfile} className="space-y-4">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={personalInfo.firstName}
                      onChange={handlePersonalInfoChange}
                      className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={personalInfo.lastName}
                      onChange={handlePersonalInfoChange}
                      className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
                    />
                  </div>
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    Username *
                  </Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={personalInfo.username}
                      onChange={handlePersonalInfoChange}
                      className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                {/* Update Button */}
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-900 text-white"
                >
                  {isUpdatingProfile ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-white">
                    Current Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white">
                    New Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm New Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400"
                      placeholder="Confirm your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Change Password Button */}
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-900 hover:to-pink-900 text-white"
                >
                  {isUpdatingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Use a strong password with at least 8 characters, including
                    letters, numbers, and symbols
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Never share your password with anyone or use the same
                    password for multiple accounts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
