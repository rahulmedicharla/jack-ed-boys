import React, {useState} from "react";
import { Text, TouchableOpacity, View, TextInput, Touchable } from "react-native";
import BasePage from "../BasePage";
import { highlightOrange, secondary, styles } from "../Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authResponse, createUser, registerUser } from "../../backend/auth_helper";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { AntDesign } from '@expo/vector-icons';

export default function Register(){

    const [registerUser, setRegisterUser] = useState<registerUser>({
        status: 'acctInformation',
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    })

    const handleChange = (text:string, field:string) => {
        setRegisterUser({
            ...registerUser,
            [field]: text
        })
    }

    const [error, setError] = useState("");

    const toggleNext = () => {
        if (registerUser.status == 'acctInformation'){
            setRegisterUser({
                ...registerUser,
                status: 'personalInformation'
            })
        }else{
            setRegisterUser({
                ...registerUser,
                status: 'acctInformation'
            })
        }
    }

    const handleRegister = () => {

        if (registerUser.password !== registerUser.confirmPassword){
            setError("Passwords do not match");
            return;
        }else if (registerUser.email.includes("@") == false){
            setError("Please enter a valid email");
            return;
        }
        for (const [key, value] of Object.entries(registerUser)) {
            if (value == "" || value == null || value == undefined){
                setError("Please fill out all fields");
                return;
            }
        }

        createUser(registerUser).then((response: authResponse) => {
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

                {registerUser.status == 'acctInformation' ? (
                    <View style={styles.container}>
                        <Text style={styles.h1}>Register Account</Text>
                        <Text style={styles.h3}>Enter your information below to create account</Text>
                        <Text style={styles.error}>{error}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="username"
                            value={registerUser.username}
                            onChangeText={(text) => handleChange(text, "username")}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="email"
                            keyboardType="email-address"
                            value={registerUser.email}
                            onChangeText={(text) => handleChange(text, 'email')}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="password"
                            secureTextEntry
                            value={registerUser.password}
                            onChangeText={(text) => handleChange(text, 'password')}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="confirm Password"
                            secureTextEntry
                            value={registerUser.confirmPassword}
                            onChangeText={(text) => handleChange(text, 'confirmPassword')}
                        />

                        <TouchableOpacity onPress={toggleNext} style={styles.button}>
                            <Text style={styles.h3}>Next</Text>
                        </TouchableOpacity>

                    </View>
                ):(
                    <View style={styles.container}>
                        <Text style={styles.h1}>Provide some info</Text>
                        <Text style={styles.h3}>Enter some preliminary information below</Text>
                        <Text style={styles.error}>{error}</Text>
                        <RadioButtonGroup containerStyle={styles.horizontalContainer} selected={registerUser.gender} onSelected = {(value) => handleChange(value, 'gender')} radioBackground={highlightOrange}>
                            <Text style={styles.h3}>Sex:</Text>
                            <RadioButtonItem value={"male"} label={<Text style={styles.h3}>Male</Text>}></RadioButtonItem>
                            <RadioButtonItem value={"female"} label={<Text style={styles.h3}>Female</Text>}></RadioButtonItem>
                        </RadioButtonGroup>

                        <View style={styles.horizontalContainer}>
                            <Text style={styles.h3}>Age:</Text>
                            <TextInput
                                style={styles.subInput}
                                placeholder="Ex. 20"
                                keyboardType="decimal-pad"
                                value={registerUser.age ? registerUser.age.toString() : ""}
                                onChangeText={(text) => handleChange(text, 'age')}
                            />
                        </View>

                        <View style={styles.horizontalContainer}>
                            <Text style={styles.h3}>Height:</Text>
                            <TextInput
                                style={styles.subInput}
                                placeholder="Ex. 5.9"
                                keyboardType="decimal-pad"
                                value={registerUser.height ? registerUser.height.toString() : ""}
                                onChangeText={(text) => handleChange(text, 'height')}
                            />
                        </View>

                        <View style={styles.horizontalContainer}>
                            <Text style={styles.h3}>Weight:</Text>
                            <TextInput
                                style={styles.subInput}
                                placeholder="Ex. 150"
                                keyboardType="decimal-pad"
                                value={registerUser.weight ? registerUser.weight.toString() : ""}
                                onChangeText={(text) => handleChange(text, 'weight')}
                            />
                        </View>

                        <RadioButtonGroup containerStyle={styles.horizontalContainer} selected={registerUser.goal} onSelected = {(value) => handleChange(value, 'goal')} radioBackground={highlightOrange}>
                            <Text style={styles.h3}>Goal:</Text>
                            <RadioButtonItem value={"bulk"} label={<Text style={styles.h3}>Bulk</Text>}></RadioButtonItem>
                            <RadioButtonItem value={"cut"} label={<Text style={styles.h3}>Cut</Text>}></RadioButtonItem>
                            <RadioButtonItem value={"maintain"} label={<Text style={styles.h3}>Maintain</Text>}></RadioButtonItem>
                        </RadioButtonGroup>

                        <View style={styles.horizontalContainer}>
                            <Text style={styles.h3}>Activity Level:</Text>
                            <View style={styles.container}>
                                <RadioButtonGroup containerStyle={styles.horizontalContainer} selected={registerUser.activityLevel} onSelected = {(value) => handleChange(value, 'activityLevel')} radioBackground={highlightOrange}>
                                    <RadioButtonItem value={"none"} label={<Text style={styles.h3}>None</Text>}></RadioButtonItem>
                                    <RadioButtonItem value={"light"} label={<Text style={styles.h3}>Light</Text>}></RadioButtonItem>                                    
                                </RadioButtonGroup>
                                <RadioButtonGroup containerStyle={styles.horizontalContainer} selected={registerUser.activityLevel} onSelected = {(value) => handleChange(value, 'activityLevel')} radioBackground={highlightOrange}>
                                    <RadioButtonItem value={"moderate"} label={<Text style={styles.h3}>Moderate</Text>}></RadioButtonItem>
                                    <RadioButtonItem value={"heavy"} label={<Text style={styles.h3}>Heavy</Text>}></RadioButtonItem>
                                </RadioButtonGroup>
                            </View>
                        </View>                                           
                                                    
                        <TouchableOpacity onPress={handleRegister} style={styles.button}>
                            <Text style={styles.h3}>Register</Text>
                        </TouchableOpacity>

                    </View>
                )}
                
            </KeyboardAwareScrollView>
        </BasePage>
    );
};