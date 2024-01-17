import React, {useState} from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import BasePage from "../BasePage";
import { styles } from "../Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authResponse, createUser } from "../../backend/auth_helper";

export default function Register(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleRegister = () => {

        if (password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }else if (email.includes("@") == false){
            setError("Please enter a valid email");
            return;
        }

        createUser(email, password, username).then((response: authResponse) => {
            if (response.status == "error"){
                setError(response.error);
            }
        })
    }

    return (
        <BasePage>
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} 
                scrollEnabled={false}
                contentContainerStyle={{flex: 1}}>

                <View style={styles.container}>
                    <Text style={styles.h1}>Register Account</Text>
                    <Text style={styles.h3}>Enter your information below to create account</Text>
                    <Text style={styles.error}>{error}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="username"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                    />
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
                    <TextInput
                        style={styles.input}
                        placeholder="confirm Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                    />

                    <TouchableOpacity onPress={handleRegister} style={styles.button}>
                        <Text style={styles.h3}>Register</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAwareScrollView>
        </BasePage>
    );
};