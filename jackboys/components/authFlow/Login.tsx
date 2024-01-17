import React, { useState } from "react";
import { View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import BasePage from "../BasePage";
import { styles } from "../Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { login } from "../../backend/auth_helper";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {

        if (email.includes("@") == false) {
            setError("Please enter a valid email");
            return;
        }

        login(email, password).then((response) => {
            if (response.status == "error") {
                setError(response.error);
            }
        })
        
    };

    return (
        <BasePage>
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} 
                contentContainerStyle={styles.container}
                scrollEnabled={false}>
                    <View style={styles.gappedContainer}>
                        <View style={styles.container}>
                            <Text style={styles.h1}>Login</Text>
                            <Text style={styles.h3}>Login with your information below</Text>
                            <Text style={styles.error}>{error}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="email"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="password"
                                secureTextEntry
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                        </View>
                        <View style={styles.container}>    
                            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                                <Text style={styles.h3}>Login</Text>
                            </TouchableOpacity>
                        </View>
                </View>
            </KeyboardAwareScrollView>
        </BasePage>
    );
}