import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BasePage from "../BasePage";
import { styles } from "../Styles";
import { Image } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList, route } from "../../backend/auth_helper";
  
  // Use these in your component props
interface LandingProps {
    navigation: NavigationProp<RootStackParamList>;
}

export default function Landing({navigation}: LandingProps){

    return (
        <BasePage>
            <View style={styles.gappedContainer}>
                <View style={styles.container}>
                    <Text style={styles.h1}>Welcome to</Text>
                    <Text style={styles.h1}>Jackboys</Text>
                    <Text style={styles.h3}>Achieve your goals today</Text>    
                </View>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => route(navigation, "Login")} style={styles.button}>
                    <Text style={styles.h3}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => route(navigation, "Register")} style={styles.button}>
                    <Text style={styles.h3}>Register</Text>
                </TouchableOpacity>
                </View>
            </View>
        </BasePage>
    );
};