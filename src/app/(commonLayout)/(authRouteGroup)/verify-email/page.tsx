import VerifyEmailForm from "@/components/modules/Auth/VerifyEmailForm";

interface VerifyEmailParams {
    searchParams: Promise<{ email?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailParams) => {
    const params = await searchParams;
    return <VerifyEmailForm email={params.email || ""} />;
};

export default VerifyEmailPage;
