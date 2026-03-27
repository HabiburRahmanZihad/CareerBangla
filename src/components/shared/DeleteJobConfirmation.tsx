"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface DeleteJobConfirmationProps {
    isOpen: boolean;
    jobTitle: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const DeleteJobConfirmation = ({
    isOpen,
    jobTitle,
    onConfirm,
    onCancel,
    isLoading = false,
}: DeleteJobConfirmationProps) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError("Please provide a reason for deletion");
            return;
        }
        onConfirm(reason.trim());
        setReason("");
        setError("");
    };

    const handleCancel = () => {
        setReason("");
        setError("");
        onCancel();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={handleCancel}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">Delete Job</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to permanently delete the job <strong>&quot;{jobTitle}&quot;</strong>?
                        This action cannot be undone, and the recruiter will be notified.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-3 py-4">
                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Reason for Deletion <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                            placeholder="Please provide a reason for deleting this job (e.g., Against company policy, Duplicate posting, Inappropriate content, etc.)"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setError("");
                            }}
                            className="mt-2 min-h-24 resize-none"
                            disabled={isLoading}
                        />
                        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
                    </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                    <AlertDialogCancel disabled={isLoading} onClick={handleCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isLoading || !reason.trim()}
                        onClick={handleConfirm}
                    >
                        {isLoading ? "Deleting..." : "Delete Job"}
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteJobConfirmation;
