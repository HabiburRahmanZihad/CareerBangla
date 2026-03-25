"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface UserEditModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const UserEditModal = ({ user, isOpen, onClose, onSave }: UserEditModalProps) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        image: user.image || "",
        isPremium: user.isPremium || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md md:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit User Information</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="User name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+880 1700 000000"
                        />
                    </div>

                    <div>
                        <Label htmlFor="image">Profile Image URL</Label>
                        <Input
                            id="image"
                            name="image"
                            type="url"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="isPremium"
                            name="isPremium"
                            checked={formData.isPremium}
                            onCheckedChange={(checked) =>
                                setFormData(prev => ({ ...prev, isPremium: checked as boolean }))
                            }
                        />
                        <Label htmlFor="isPremium" className="cursor-pointer">
                            Mark as Premium User
                        </Label>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserEditModal;
