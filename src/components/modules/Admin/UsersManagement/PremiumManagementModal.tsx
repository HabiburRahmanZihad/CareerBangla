"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUser } from "@/services/admin.services";
import { IUserWithDetails } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface PremiumManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: IUserWithDetails;
}

const PremiumManagementModal = ({ isOpen, onClose, user }: PremiumManagementModalProps) => {
    const queryClient = useQueryClient();
    const [durationOption, setDurationOption] = useState("30");
    const [customDays, setCustomDays] = useState("30");

    const { mutateAsync: doUpdateUser, isPending } = useMutation({
        mutationFn: (data: any) => updateUser(user.id, data),
        onSuccess: () => {
            toast.success("Premium status updated successfully");
            queryClient.invalidateQueries({ queryKey: ["users-with-details"] });
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update premium status"),
    });

    const handleGrantPremium = async () => {
        const days = durationOption === "custom" ? customDays : durationOption;
        if (!days || parseInt(days) < 1) {
            toast.error("Please enter a valid number of days");
            return;
        }

        const premiumUntil = new Date();
        premiumUntil.setDate(premiumUntil.getDate() + parseInt(days));

        await doUpdateUser({
            isPremium: true,
            premiumUntil: premiumUntil.toISOString(),
        });
    };

    const handleRevokePremium = async () => {
        await doUpdateUser({
            isPremium: false,
            premiumUntil: null,
        });
    };

    const handleExtendPremium = async () => {
        if (!user.premiumUntil) {
            toast.error("User is not a premium member");
            return;
        }

        const days = durationOption === "custom" ? customDays : durationOption;
        if (!days || parseInt(days) < 1) {
            toast.error("Please enter a valid number of days");
            return;
        }

        const currentExpiry = new Date(user.premiumUntil);
        currentExpiry.setDate(currentExpiry.getDate() + parseInt(days));

        await doUpdateUser({
            premiumUntil: currentExpiry.toISOString(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6">
                <DialogHeader className="mb-6">
                    <DialogTitle>Premium Membership Management</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Current Status */}
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                        <p className="text-sm font-semibold">Current Status</p>
                        <p className="text-sm text-muted-foreground">
                            {user.isPremium
                                ? `Premium until ${new Date(user.premiumUntil || "").toLocaleDateString()}`
                                : "Not a premium member"}
                        </p>
                    </div>

                    {/* Duration Options */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Duration</Label>
                        <RadioGroup value={durationOption} onValueChange={setDurationOption}>
                            <div className="flex items-center space-x-3 py-2">
                                <RadioGroupItem value="30" id="30days" />
                                <Label htmlFor="30days" className="font-normal cursor-pointer">30 days</Label>
                            </div>
                            <div className="flex items-center space-x-3 py-2">
                                <RadioGroupItem value="90" id="90days" />
                                <Label htmlFor="90days" className="font-normal cursor-pointer">90 days</Label>
                            </div>
                            <div className="flex items-center space-x-3 py-2">
                                <RadioGroupItem value="180" id="180days" />
                                <Label htmlFor="180days" className="font-normal cursor-pointer">6 months (180 days)</Label>
                            </div>
                            <div className="flex items-center space-x-3 py-2">
                                <RadioGroupItem value="365" id="365days" />
                                <Label htmlFor="365days" className="font-normal cursor-pointer">1 year (365 days)</Label>
                            </div>
                            <div className="flex items-center space-x-3 py-2">
                                <RadioGroupItem value="custom" id="custom" />
                                <Label htmlFor="custom" className="font-normal cursor-pointer">Custom duration</Label>
                            </div>
                        </RadioGroup>

                        {durationOption === "custom" && (
                            <div className="flex items-center gap-3 mt-3 pt-2">
                                <Input
                                    type="number"
                                    min="1"
                                    value={customDays}
                                    onChange={(e) => setCustomDays(e.target.value)}
                                    placeholder="Number of days"
                                    className="flex-1"
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">days</span>
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <p className="font-semibold text-sm text-blue-900">Premium Benefits:</p>
                        <ul className="text-sm space-y-2 text-blue-700">
                            <li className="flex items-center gap-2">✓ Priority job listings</li>
                            <li className="flex items-center gap-2">✓ Advanced resume features</li>
                            <li className="flex items-center gap-2">✓ Premium support</li>
                            <li className="flex items-center gap-2">✓ Unlimited applications</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    {user.isPremium ? (
                        <>
                            <Button onClick={handleExtendPremium} disabled={isPending}>
                                Extend Premium
                            </Button>
                            <Button variant="destructive" onClick={handleRevokePremium} disabled={isPending}>
                                Revoke Premium
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleGrantPremium} disabled={isPending}>
                            Grant Premium
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PremiumManagementModal;
