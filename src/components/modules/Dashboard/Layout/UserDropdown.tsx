"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteCookie } from "@/lib/cookieUtils";
import { IApplication, UserInfo } from "@/types/user.types";
import { Award, Crown, Key, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserDropdownProps {
    userInfo: UserInfo
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
    const router = useRouter();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const onConfirmLogout = async () => {
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");
        await deleteCookie("better-auth.session_token");
        router.push("/login");
        router.refresh();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} size={"icon"} className="rounded-full relative">
                        <span className="text-sm font-semibold">
                            {userInfo.name.charAt(0).toUpperCase()}
                        </span>
                        {userInfo.isPremium && (
                            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${userInfo.role === "RECRUITER" ? "bg-blue-500" : "bg-amber-500"}`}>
                                <Crown className="h-2.5 w-2.5 text-white" />
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>


                <DropdownMenuContent align={"end"} className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <p className="text-sm font-medium">
                                    {userInfo.name}
                                </p>
                                <div className="flex items-center gap-1 flex-wrap justify-end">
                                    {userInfo.applications?.some((app: IApplication) => app.status === "HIRED") && (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
                                            <Award className="h-3 w-3" />
                                            Hired
                                        </Badge>
                                    )}
                                    {userInfo.isPremium && userInfo.role === "RECRUITER" && (
                                        <Badge className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 text-white">
                                            <Crown className="h-3 w-3" />
                                            Premium
                                        </Badge>
                                    )}
                                    {userInfo.isPremium && userInfo.role !== "RECRUITER" && (
                                        <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                                            <Crown className="h-3 w-3" />
                                            Pro
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                {userInfo.email}
                            </p>

                            <p className="text-xs text-primary capitalize">
                                {userInfo.role.toLowerCase().replace("_", " ")}
                            </p>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <Link href={"/my-profile"}>
                            <User className="mr-2 h-4 w-4" />
                            My Profile
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={"/change-password"}>
                            <Key className="mr-2 h-4 w-4" />
                            Change Password
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to logout? You will need to login again to access your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onConfirmLogout} className="bg-red-600 hover:bg-red-700">
                            Logout
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default UserDropdown
