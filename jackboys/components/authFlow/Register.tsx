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
                scrollEnabled={false}>

                <View style={styles.container}>
                    <Text style={styles.h1}>Please Register</Text>
                    <Text style={styles.error}>{error}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                    />

                    <TouchableOpacity onPress={handleRegister} style={styles.button}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAwareScrollView>
        </BasePage>
    );
};