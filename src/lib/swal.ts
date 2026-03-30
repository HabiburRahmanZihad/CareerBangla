import Swal, { SweetAlertResult } from "sweetalert2";

// ── Base theme config ──────────────────────────────────────────────────────
const base = {
    customClass: {
        popup: "!rounded-2xl !shadow-2xl !border !border-border/40 !bg-background !text-foreground !font-sans",
        title: "!text-foreground !font-black !text-lg",
        htmlContainer: "!text-muted-foreground !text-sm !leading-relaxed",
        confirmButton: "!rounded-xl !font-bold !px-5 !py-2.5 !text-sm !transition-all",
        cancelButton: "!rounded-xl !font-bold !px-5 !py-2.5 !text-sm !bg-transparent !text-foreground !border !border-border/60 hover:!bg-muted/60 !transition-all",
        actions: "!gap-3 !mt-2",
        icon: "!border-0 !mb-0",
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
}): Promise<SweetAlertResult<string>> => {
    const isDanger = opts.danger ?? false;

    // Custom icon: coloured circle + SVG — avoids the bare "!" from SweetAlert2's
    // built-in warning icon when its border is stripped by the base customClass.
    const iconHtml = isDanger
        ? `<div style="display:flex;align-items:center;justify-content:center;
                width:60px;height:60px;border-radius:50%;
                background:#fef2f2;border:2px solid #fecaca;margin:0 auto;">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                viewBox="0 0 24 24" fill="none" stroke="#dc2626"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
           </div>`
        : `<div style="display:flex;align-items:center;justify-content:center;
                width:60px;height:60px;border-radius:50%;
                background:#eff6ff;border:2px solid #bfdbfe;margin:0 auto;">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                viewBox="0 0 24 24" fill="none" stroke="#2563eb"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
           </div>`;

    const resetInputStyle = (input: HTMLElement) => {
        input.style.boxShadow = "none";
        input.style.outline = "none";
        input.style.borderColor = "hsl(var(--border))";
        input.style.backgroundColor = "hsl(var(--background))";
        input.style.color = "hsl(var(--foreground))";
        input.style.boxSizing = "border-box";
        input.style.width = "100%";
        input.style.maxWidth = "100%";
    };

    return Swal.fire<string>({
        ...base,
        title: opts.title,
        text: opts.text,
        iconHtml,
        input: "textarea",
        inputPlaceholder: opts.inputPlaceholder ?? "Enter reason...",
        inputAttributes: { rows: "3" },
        inputValidator: (value) => {
            if (!value || !value.trim()) return "Please provide a reason.";
        },
        scrollbarPadding: false,
        didOpen: () => {
            // Fix popup overflow so the textarea can't bleed outside the modal
            const popup = Swal.getPopup();
            if (popup) {
                popup.style.overflow = "hidden";
                popup.style.boxSizing = "border-box";
            }

            const input = Swal.getInput();
            if (input) {
                resetInputStyle(input);
                // Re-apply on focus/blur because SweetAlert2 re-applies its own
                // border-color and box-shadow on these events
                input.addEventListener("focus", () => resetInputStyle(input));
                input.addEventListener("blur", () => resetInputStyle(input));
            }
        },
        customClass: {
            ...base.customClass,
            popup: base.customClass.popup + " !overflow-hidden",
            icon: "!border-0 !mb-1 !shadow-none",
            input: [
                "!rounded-xl !border !border-border/60",
                "!bg-background !text-foreground !text-sm",
                "!p-3 !mt-2 !resize-none",
                "!shadow-none !outline-none",
                "!w-full !max-w-full !box-border",
            ].join(" "),
            confirmButton:
                base.customClass.confirmButton +
                (isDanger
                    ? " !bg-destructive !text-white hover:!opacity-90"
                    : " !bg-primary !text-primary-foreground hover:!opacity-90"),
            validationMessage:
                "!text-destructive !text-xs !bg-transparent !shadow-none !border-0 !p-0 !mt-1",
        },
        showCancelButton: true,
        confirmButtonText: opts.confirmText ?? "Confirm",
        cancelButtonText: opts.cancelText ?? "Cancel",
        confirmButtonColor: isDanger
            ? "hsl(var(--destructive))"
            : "hsl(var(--primary))",
    });
};

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

// ── Error alert ────────────────────────────────────────────────────────────
export const swalError = (title: string, text?: string) =>
    Swal.fire({
        ...base,
        title,
        text,
        icon: "error",
        iconColor: "hsl(var(--destructive))",
        confirmButtonText: "OK",
        confirmButtonColor: "hsl(var(--destructive))",
        customClass: {
            ...base.customClass,
            confirmButton: base.customClass.confirmButton + " !bg-destructive !text-white hover:!opacity-90",
        },
    });

// ── Info alert ─────────────────────────────────────────────────────────────
export const swalInfo = (title: string, text?: string) =>
    Swal.fire({
        ...base,
        title,
        text,
        icon: "info",
        iconColor: "hsl(var(--primary))",
        confirmButtonText: "OK",
        confirmButtonColor: "hsl(var(--primary))",
        customClass: {
            ...base.customClass,
            confirmButton: base.customClass.confirmButton + " !bg-primary !text-primary-foreground hover:!opacity-90",
        },
    });

// ── HTML Modal (for complex content) ───────────────────────────────────────
export const swalModal = (opts: {
    title: string;
    html: string;
    width?: string;
    confirmText?: string;
}): Promise<SweetAlertResult> =>
    Swal.fire({
        ...base,
        title: opts.title,
        html: opts.html,
        width: opts.width ?? "600px",
        didOpen: () => {
            const content = Swal.getHtmlContainer();
            if (content) {
                content.classList.add("!overflow-y-auto", "!max-h-96", "!text-left");
            }
        },
        showConfirmButton: true,
        confirmButtonText: opts.confirmText ?? "Close",
        confirmButtonColor: "hsl(var(--primary))",
        customClass: {
            ...base.customClass,
            confirmButton: base.customClass.confirmButton + " !bg-primary !text-primary-foreground hover:!opacity-90",
            htmlContainer: "!text-sm !leading-relaxed !bg-muted/30 !p-4 !rounded-lg",
        },
    });

// ── Scrollable HTML Modal ──────────────────────────────────────────────────
export const swalDetailModal = (opts: {
    title: string;
    html: string;
    width?: string;
}): Promise<SweetAlertResult> =>
    Swal.fire({
        ...base,
        title: opts.title,
        html: opts.html,
        width: opts.width ?? "700px",
        scrollbarPadding: false,
        didOpen: () => {
            const container = Swal.getHtmlContainer();
            if (container) {
                container.classList.add("overflow-y-auto");
                container.style.maxHeight = "400px";
                container.style.fontSize = "0.875rem";
            }
        },
        showConfirmButton: true,
        confirmButtonText: "Close",
        confirmButtonColor: "hsl(var(--primary))",
        customClass: {
            ...base.customClass,
            confirmButton: base.customClass.confirmButton + " !bg-primary !text-primary-foreground hover:!opacity-90",
        },
    });
