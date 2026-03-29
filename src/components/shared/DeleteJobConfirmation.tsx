"use client";

import { swalInput } from "@/lib/swal";

interface DeleteJobConfirmationProps {
    jobTitle: string;
    onConfirm: (reason: string) => void;
    trigger: (open: () => void) => React.ReactNode;
}

export const DeleteJobConfirmation = ({ jobTitle, onConfirm, trigger }: DeleteJobConfirmationProps) => {
    const open = async () => {
        const result = await swalInput({
            title: "Delete Job",
            text: `You are about to permanently delete "${jobTitle}". This action cannot be undone.`,
            inputPlaceholder: "Please provide a reason for deletion (e.g. Against policy, Duplicate posting...)",
            confirmText: "Delete Job",
            cancelText: "Cancel",
            danger: true,
        });
        if (result.isConfirmed && result.value) {
            onConfirm(result.value);
        }
    };

    return <>{trigger(open)}</>;
};

export default DeleteJobConfirmation;
