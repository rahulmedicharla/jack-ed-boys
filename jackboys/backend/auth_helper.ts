import { NavigationProp } from "@react-navigation/native";

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    // Add other routes here
};

export const route = (navigation: NavigationProp<RootStackParamList>, destination: keyof RootStackParamList) => {
    navigation.navigate(destination);
}