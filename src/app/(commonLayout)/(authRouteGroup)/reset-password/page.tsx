import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";

interface ResetPasswordParams {
    searchParams: Promise<{ email?: string }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordParams) => {
    const params = await searchParams;
    return <ResetPasswordForm email={params.email || ""} />;
};

export default ResetPasswordPage;
