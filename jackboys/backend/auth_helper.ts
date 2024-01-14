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

export const route = (navigation: NavigationProp<RootStackParamList>, destination: keyof RootStackParamList) => {
    navigation.navigate(destination);
}

export const createUser = async (email: string, password: string, username: string) => {
    const auth = getAuth();

    try{
        const user = await createUserWithEmailAndPassword(auth, email, password);
        await createNewUserDocument(user, username);
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