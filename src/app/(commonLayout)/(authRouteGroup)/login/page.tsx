import LoginForm from "@/components/modules/Auth/LoginForm";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

interface LoginParams {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const userInfo = await getUserInfo();

  // If user is already logged in, redirect to their dashboard
  if (userInfo) {
    redirect(getDefaultDashboardRoute(userInfo.role));
  }

  const params = await searchParams;
  const redirectPath = params.redirect;
  const error = params.error;

  return (
    <LoginForm redirectPath={redirectPath} oauthError={error} />
  )
}

export default LoginPage
