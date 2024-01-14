import React from "react";
import { Text, TouchableOpacity } from "react-native";
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
            <Image source={require('../images/icon.png')} style={styles.image}></Image>
            <Text style={styles.h1}>Welcome to Jackboys </Text>
            <Text style={styles.h1}>Select to get started</Text>
            <TouchableOpacity onPress={() => route(navigation, "Login")} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => route(navigation, "Register")} style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </BasePage>
    );
};