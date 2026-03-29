import Swal, { SweetAlertResult } from "sweetalert2";

// ── Base theme config ──────────────────────────────────────────────────────
const base = {
    customClass: {
        popup:          "!rounded-2xl !shadow-2xl !border !border-border/40 !bg-background !text-foreground !font-sans",
        title:          "!text-foreground !font-black !text-lg",
        htmlContainer:  "!text-muted-foreground !text-sm !leading-relaxed",
        confirmButton:  "!rounded-xl !font-bold !px-5 !py-2.5 !text-sm !transition-all",
        cancelButton:   "!rounded-xl !font-bold !px-5 !py-2.5 !text-sm !bg-transparent !text-foreground !border !border-border/60 hover:!bg-muted/60 !transition-all",
        actions:        "!gap-3 !mt-2",
        icon:           "!border-0 !mb-0",
    },
    buttonsStyling: true,
    reverseButtons: true,
    showCloseButton: false,
};

// ── Danger/destructive confirm ─────────────────────────────────────────────
export const swalDanger = (opts: {
    title: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
}): Promise<SweetAlertResult> =>
    Swal.fire({
        ...base,
        title: opts.title,
        text: opts.text,
        icon: "warning",
        iconColor: "hsl(var(--destructive))",
        showCancelButton: true,
        confirmButtonText: opts.confirmText ?? "Confirm",
        cancelButtonText: opts.cancelText ?? "Cancel",
        confirmButtonColor: "hsl(var(--destructive))",
        customClass: {
            ...base.customClass,
            confirmButton: base.customClass.confirmButton + " !bg-destructive !text-white hover:!opacity-90",
        },
    });

// ── Generic confirm (non-destructive) ─────────────────────────────────────
export const swalConfirm = (opts: {
    title: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
    icon?: "info" | "question" | "success" | "warning";
}): Promise<SweetAlertResult> =>
    Swal.fire({
        ...base,
        title: opts.title,
        text: opts.text,
        icon: opts.icon ?? "question",
        iconColor: "hsl(var(--primary))",
        showCancelButton: true,
        confirmButtonText: opts.confirmText ?? "Confirm",
        cancelButtonText: opts.cancelText ?? "Cancel",
        confirmButtonColor: "hsl(var(--primary))",
        customClass: {
            ...base.customClass,
            confirmButton: base.customClass.confirmButton + " !bg-primary !text-primary-foreground hover:!opacity-90",
        },
    });

// ── Input confirm (with textarea for reason) ──────────────────────────────
export const swalInput = (opts: {
    title: string;
    text: string;
    inputPlaceholder?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
}): Promise<SweetAlertResult<string>> =>
    Swal.fire<string>({
        ...base,
        title: opts.title,
        text: opts.text,
        icon: "warning",
        iconColor: opts.danger ? "hsl(var(--destructive))" : "hsl(var(--primary))",
        input: "textarea",
        inputPlaceholder: opts.inputPlaceholder ?? "Enter reason...",
        inputAttributes: { rows: "3" },
        inputValidator: (value) => {
            if (!value || !value.trim()) return "Please provide a reason.";
        },
        customClass: {
            ...base.customClass,
            input: "!rounded-xl !border !border-border/60 !bg-background !text-foreground !text-sm !p-3 !mt-2 !w-full focus:!ring-2 focus:!ring-primary/30 !resize-none",
            confirmButton: base.customClass.confirmButton + (opts.danger ? " !bg-destructive !text-white hover:!opacity-90" : " !bg-primary !text-primary-foreground hover:!opacity-90"),
        },
        showCancelButton: true,
        confirmButtonText: opts.confirmText ?? "Confirm",
        cancelButtonText: opts.cancelText ?? "Cancel",
        confirmButtonColor: opts.danger ? "hsl(var(--destructive))" : "hsl(var(--primary))",
    });

// ── Success toast ──────────────────────────────────────────────────────────
export const swalSuccess = (title: string, text?: string) =>
    Swal.fire({
        ...base,
        title,
        text,
        icon: "success",
        iconColor: "hsl(var(--primary))",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        position: "top-end",
        customClass: {
            popup: "!rounded-2xl !shadow-lg !border !border-border/40 !bg-background !text-foreground",
        },
    });
