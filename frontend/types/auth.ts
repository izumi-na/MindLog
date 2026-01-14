export type AuthContextType = {
	isAuthenticated: boolean;
	email: string | null;
	setIsAuthenticated: (value: boolean) => void;
	setEmail: (email: string | null) => void;
	isLoading: boolean;
	setIsLoading: (value: boolean) => void;
};
