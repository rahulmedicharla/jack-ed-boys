import React, {ReactNode} from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./Styles";
import { LinearGradient } from "expo-linear-gradient";

interface BasePageProps {
    children: ReactNode;
}

export default function BasePage({ children }: BasePageProps) {
    return (
        <LinearGradient
        // Background Linear Gradient
        colors={['rgba(33, 28, 41, 1)', 'rgba(55, 30, 65, .5)']}
        style={{flex: 1}}
        >
            <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
}