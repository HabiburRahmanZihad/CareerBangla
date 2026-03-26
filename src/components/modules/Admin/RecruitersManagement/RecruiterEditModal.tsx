"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface RecruiterEditModalProps {
    recruiter: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const RecruiterEditModal = ({ recruiter, isOpen, onClose, onSave }: RecruiterEditModalProps) => {
    const [formData, setFormData] = useState({
        name: recruiter.name,
        email: recruiter.email,
        profilePhoto: recruiter.profilePhoto || "",
        contactNumber: recruiter.contactNumber || "",
        companyName: recruiter.companyName || "",
        companyLogo: recruiter.companyLogo || "",
        companyWebsite: recruiter.companyWebsite || "",
        companyAddress: recruiter.companyAddress || "",
        designation: recruiter.designation || "",
        industry: recruiter.industry || "",
        companySize: recruiter.companySize || "",
        description: recruiter.description || "",
    });
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmSave = () => {
        onSave(formData);
        setShowConfirm(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Recruiter Information</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Recruiter name"
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
                                    placeholder="recruiter@example.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="contactNumber">Contact Number</Label>
                                <Input
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    placeholder="+880 1700 000000"
                                />
                            </div>

                            <div>
                                <Label htmlFor="designation">Designation</Label>
                                <Input
                                    id="designation"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    placeholder="Job Title"
                                />
                            </div>

                            <div>
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    placeholder="e.g., Technology, Finance"
                                />
                            </div>

                            <div>
                                <Label htmlFor="companySize">Company Size</Label>
                                <Input
                                    id="companySize"
                                    name="companySize"
                                    value={formData.companySize}
                                    onChange={handleChange}
                                    placeholder="e.g., 50-100, 100-500"
                                />
                            </div>

                            <div>
                                <Label htmlFor="companyWebsite">Company Website</Label>
                                <Input
                                    id="companyWebsite"
                                    name="companyWebsite"
                                    type="url"
                                    value={formData.companyWebsite}
                                    onChange={handleChange}
                                    placeholder="https://company.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="profilePhoto">Profile Photo URL</Label>
                                <Input
                                    id="profilePhoto"
                                    name="profilePhoto"
                                    type="url"
                                    value={formData.profilePhoto}
                                    onChange={handleChange}
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>

                            <div>
                                <Label htmlFor="companyLogo">Company Logo URL</Label>
                                <Input
                                    id="companyLogo"
                                    name="companyLogo"
                                    type="url"
                                    value={formData.companyLogo}
                                    onChange={handleChange}
                                    placeholder="https://example.com/logo.jpg"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="companyAddress">Company Address</Label>
                            <Input
                                id="companyAddress"
                                name="companyAddress"
                                value={formData.companyAddress}
                                onChange={handleChange}
                                placeholder="Full address"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Company description or recruiting focus"
                                rows={4}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitClick}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to save these changes for <strong>{formData.name}</strong>? This action will update their recruiter profile information.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSave}>
                            Save Changes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default RecruiterEditModal;
