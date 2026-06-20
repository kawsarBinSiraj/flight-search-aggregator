// import api from "./api";
import type {
    LoginCredentials,
    LoginResponse,
    SignupCredentials,
    SignupResponse,
    ResetPasswordCredentials,
    VerifyEmailCredentials,
    ProfileResponse,
} from "@/types";

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        // const { data } = await api.post<LoginResponse>("/api/auth/login", credentials);
        const user = { id: "demo-id", email: credentials.email, name: "Demo User" };
        return { user, token: "", message: "Login successful" };
    },

    signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
        return credentials as unknown as SignupResponse;
    },

    logout: async (): Promise<void> => {
        return Promise.resolve();
    },

    getProfile: async (): Promise<ProfileResponse> => {
        return { user: { id: "demo-id", email: "admin@example.com", name: "Demo User" } };
    },

    resetPassword: async (credentials: ResetPasswordCredentials): Promise<{ message: string }> => {
        return { message: "Password reset successful", ...credentials };
    },

    verifyEmail: async (credentials: VerifyEmailCredentials): Promise<{ message: string }> => {
        return { message: "Email verified successfully", ...credentials };
    },
};
