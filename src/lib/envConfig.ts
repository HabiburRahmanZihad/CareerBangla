const envConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    nodeEnv: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
};

export default envConfig;
