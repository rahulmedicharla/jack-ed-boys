import { NavigationProp } from "@react-navigation/native";
import { UserCredential, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createNewUserDocument } from "./db_helper";

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    // Add other routes here
};

export type authResponse = {
    status: "success" | "error",
    error: string | null,
    user: UserCredential | null
}

export type registerUser = {
    status: 'acctInformation' | 'personalInformation',
    email: string,
    password: string,
    confirmPassword: string,
    username: string,
    goal?: 'cut' | 'bulk' | 'maintain',
    height?: string,
    weight?: string,
    gender?: 'male' | 'female',
    age?: string,
    activityLevel?: 'none' | 'light' | 'moderate' | 'heavy',
} | null

export const route = (navigation: NavigationProp<RootStackParamList>, destination: keyof RootStackParamList) => {
    navigation.navigate(destination);
}

export const createUser = async (registerUser: registerUser) => {
    const auth = getAuth();

    try{
        const user = await createUserWithEmailAndPassword(auth, registerUser.email, registerUser.password);
        await createNewUserDocument(user, registerUser);
        return {
            status: "success",
            error: null,
            user: user
        }
    }catch(error){
        return {
            status: "error",
            error: error.message,
            user: null
        }
    }
}

export const login = async (email: string, password: string) => {
    const auth = getAuth();

    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        return {
            status: "success",
            error: null,
            user: user
        }
    } catch (error) {
        return {
            status: "error",
            error: error.message,
            user: null
        }
    }
}

export const logout = async () => {
    const auth = getAuth();

    try {
        await signOut(auth);
        return {
            status: "success",
            error: null,
            user: null
        }
    } catch (error) {
        return {
            status: "error",
            error: error.message,
            user: null
        }
    }
}