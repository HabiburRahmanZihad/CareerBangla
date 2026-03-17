import LoginForm from "@/components/modules/Auth/LoginForm";

interface LoginParams {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  const error = params.error;
  return (
    <LoginForm redirectPath={redirectPath} oauthError={error} />
  )
}

export default LoginPage
