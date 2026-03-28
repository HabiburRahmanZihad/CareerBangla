"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { httpClient } from "@/lib/axios/httpClient";
import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface PaymentSubscriptionDetail {
    id: string;
    transactionId: string | null;
    bankTransactionId: string | null;
    validationId: string | null;
    plan: string;
    amount: number;
    status: string;
    isRecruiterSubscription: boolean;
    createdAt: string;
    updatedAt: string;
    paymentHolder: {
        name: string;
        email: string;
        phone: string | null;
        role: string;
        status: string;
        country: string | null;
        isPremium: boolean;
    };
    paymentDetails: {
        gateway: string | null;
        originalAmount: number | null;
        discountAmount: number | null;
        planKey: string | null;
    };
    customerInfo: {
        name: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        postcode: string | null;
    };
}

interface PaymentDetailModalProps {
    subscriptionId: string;
    isOpen: boolean;
    onClose: () => void;
}

const DetailCell = ({ label, value, copyable = false }: { label: string; value: string | null; copyable?: boolean }) => {
    const handleCopy = () => {
        if (value) {
            navigator.clipboard.writeText(value);
            toast.success(`${label} copied`);
        }
    };

    return (
        <div className="flex justify-between py-2 border-b text-sm last:border-b-0">
            <span className="text-muted-foreground font-medium">{label}</span>
            <div className="flex items-center gap-2">
                <span>{value || "N/A"}</span>
                {copyable && value && (
                    <button onClick={handleCopy} className="hover:text-primary" title="Copy">
                        <Copy className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export function PaymentDetailModal({ subscriptionId, isOpen, onClose }: PaymentDetailModalProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["payment-detail", subscriptionId],
        queryFn: async () => {
            const res = await httpClient.get<PaymentSubscriptionDetail>(
                `/subscriptions/admin/payment-details/${subscriptionId}`
            );
            return res.data;
        },
        enabled: isOpen,
    });

    const detail = data;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Payment Subscription Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4">
                        {Array(3)
                            .fill(null)
                            .map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                    </div>
                ) : !detail ? (
                    <div className="text-center py-8 text-muted-foreground">Failed to load</div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3">Transaction Info</h3>
                            <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                                <DetailCell label="Transaction ID" value={detail.transactionId} copyable />
                                <DetailCell label="Bank TXN ID" value={detail.bankTransactionId} copyable />
                                <DetailCell label="Validation ID" value={detail.validationId} copyable />
                                <DetailCell label="Plan" value={detail.plan.replace(/_/g, " ")} />
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-muted-foreground font-medium">Status</span>
                                    <Badge variant={detail.status === "PAID" ? "default" : "secondary"}>
                                        {detail.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-3">Amount Details</h3>
                            <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                                <DetailCell
                                    label="Original Amount"
                                    value={
                                        detail.paymentDetails.originalAmount
                                            ? `৳${detail.paymentDetails.originalAmount}`
                                            : null
                                    }
                                />
                                <DetailCell
                                    label="Discount"
                                    value={
                                        detail.paymentDetails.discountAmount
                                            ? `৳${detail.paymentDetails.discountAmount}`
                                            : null
                                    }
                                />
                                <DetailCell label="Final Amount" value={`৳${detail.amount}`} />
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-3">Payment Holder</h3>
                            <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                                <DetailCell label="Name" value={detail.paymentHolder.name} />
                                <DetailCell label="Email" value={detail.paymentHolder.email} />
                                <DetailCell label="Phone" value={detail.paymentHolder.phone} />
                                <DetailCell label="Role" value={detail.paymentHolder.role} />
                                <DetailCell label="Status" value={detail.paymentHolder.status} />
                                <DetailCell label="Country" value={detail.paymentHolder.country} />
                                <DetailCell
                                    label="Premium"
                                    value={detail.paymentHolder.isPremium ? "Yes" : "No"}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-3">Customer Info</h3>
                            <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                                <DetailCell label="Name" value={detail.customerInfo.name} />
                                <DetailCell label="Phone" value={detail.customerInfo.phone} />
                                <DetailCell label="Address" value={detail.customerInfo.address} />
                                <DetailCell label="City" value={detail.customerInfo.city} />
                                <DetailCell label="Postcode" value={detail.customerInfo.postcode} />
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-3">Dates</h3>
                            <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                                <DetailCell
                                    label="Created"
                                    value={new Date(detail.createdAt).toLocaleString()}
                                />
                                <DetailCell
                                    label="Updated"
                                    value={new Date(detail.updatedAt).toLocaleString()}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
