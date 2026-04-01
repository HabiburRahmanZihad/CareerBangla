"use client";

import { getRequestErrorMessage } from "@/lib/axios/getRequestErrorMessage";
import { swalDetailModal } from "@/lib/swal";
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

const CopyButton = (value: string) => `
    <button onclick="navigator.clipboard.writeText('${value}').then(() => alert('✓ Copied!'))" 
            style="color: #3b82f6; cursor: pointer; border: none; background: none; text-decoration: underline; font-weight: 500; padding: 0; font-size: 13px;">
        📋 Copy
    </button>
`;

const DetailRow = (label: string, value: string | null, copyable: boolean = false) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.1);">
        <span style="color: #666; font-weight: 500; font-size: 14px;">${label}</span>
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 14px;">${value || "N/A"}</span>
            ${copyable && value ? CopyButton(value) : ""}
        </div>
    </div>
`;

const StatusBadge = (status: string) => `
    <span style="display: inline-block; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: bold; 
                 ${status === "PAID" ? "background: #10b981; color: white;" : "background: #f3f4f6; color: #374151;"}">
        ${status}
    </span>
`;

const Section = (title: string, content: string) => `
    <div style="margin-bottom: 20px;">
        <h4 style="font-weight: 600; margin-bottom: 12px; font-size: 15px; color: #1f2937;">${title}</h4>
        <div style="background: #f9fafb; padding: 14px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            ${content}
        </div>
    </div>
`;

export async function showPaymentDetailModal(subscriptionId: string) {
    try {
        const response = await fetch(`/api/admin/payment-subscriptions/${subscriptionId}`, {
            credentials: "include",
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success) {
            throw new Error(payload?.message || "Failed to load payment details");
        }

        const detail = payload.data as PaymentSubscriptionDetail;

        if (!detail) {
            toast.error("Failed to load payment details");
            return;
        }

        const transactionInfo = Section(
            "Transaction Info",
            `
                ${DetailRow("Transaction ID", detail.transactionId, true)}
                ${DetailRow("Bank TXN ID", detail.bankTransactionId, true)}
                ${DetailRow("Validation ID", detail.validationId, true)}
                ${DetailRow("Plan", detail.plan.replace(/_/g, " "))}
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
                    <span style="color: #666; font-weight: 500; font-size: 14px;">Status</span>
                    ${StatusBadge(detail.status)}
                </div>
            `
        );

        const amountInfo = Section(
            "Amount Details",
            `
                ${DetailRow("Original Amount", detail.paymentDetails.originalAmount ? `৳${detail.paymentDetails.originalAmount}` : null)}
                ${DetailRow("Discount", detail.paymentDetails.discountAmount ? `৳${detail.paymentDetails.discountAmount}` : null)}
                ${DetailRow("Final Amount", `৳${detail.amount}`)}
            `
        );

        const paymentHolder = Section(
            "Payment Holder",
            `
                ${DetailRow("Name", detail.paymentHolder.name)}
                ${DetailRow("Email", detail.paymentHolder.email)}
                ${DetailRow("Phone", detail.paymentHolder.phone)}
                ${DetailRow("Role", detail.paymentHolder.role)}
                ${DetailRow("Status", detail.paymentHolder.status)}
                ${DetailRow("Country", detail.paymentHolder.country)}
                ${DetailRow("Premium", detail.paymentHolder.isPremium ? "Yes" : "No")}
            `
        );

        const customerInfo = Section(
            "Customer Info",
            `
                ${DetailRow("Name", detail.customerInfo.name)}
                ${DetailRow("Phone", detail.customerInfo.phone)}
                ${DetailRow("Address", detail.customerInfo.address)}
                ${DetailRow("City", detail.customerInfo.city)}
                ${DetailRow("Postcode", detail.customerInfo.postcode)}
            `
        );

        const dates = Section(
            "Dates",
            `
                ${DetailRow("Created", new Date(detail.createdAt).toLocaleString())}
                ${DetailRow("Updated", new Date(detail.updatedAt).toLocaleString())}
            `
        );

        const html = `
            <div style="text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                ${transactionInfo}
                ${amountInfo}
                ${paymentHolder}
                ${customerInfo}
                ${dates}
            </div>
        `;

        await swalDetailModal({
            title: "Payment Subscription Details",
            html,
            width: "700px",
        });
    } catch (error: any) {
        toast.error(getRequestErrorMessage(error, "Failed to load payment details"));
    }
  }

// Export as dummy component for backward compatibility if imported as component
export function PaymentDetailModal() {
    return null;
}
