import React, {ReactNode} from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./Styles";

interface BasePageProps {
    children: ReactNode;
}

export default function BasePage({ children }: BasePageProps) {
    return (
        <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
            {children}
        </SafeAreaView>
    );
}