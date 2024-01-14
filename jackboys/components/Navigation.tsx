import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Landing from "./authFlow/Landing";
import Login from "./authFlow/Login";
import Register from "./authFlow/Register";
import { primary, secondary, tertiaryGreen, white } from "./Styles";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import Measure from "./mainFlow/Measure";
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Track from "./mainFlow/Track";
import Profile from "./mainFlow/Profile";
import Meal from "./mainFlow/Meal";
import { Ionicons } from '@expo/vector-icons';


const AuthStack = createNativeStackNavigator()
const HomeTab = createBottomTabNavigator()

export default function Navigation() {

  const [user, setUser] = useState<null | User>(null);

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);
  return (
    <>
      {user ? (
          <NavigationContainer>
            <HomeTab.Navigator screenOptions={{tabBarStyle: {backgroundColor: primary}, tabBarActiveTintColor: tertiaryGreen, tabBarInactiveTintColor: white}}>
              <HomeTab.Screen name='Measure' options={{headerShown: false, tabBarLabel: "Measure", tabBarIcon: ({color, size}) => (
                  <Octicons name="graph" size={size} color={color} />
                )}} component={Measure} />
              <HomeTab.Screen name = "Track" options={{headerShown: false, tabBarLabel: "Track", tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name="tape-measure" size={size} color={color} />
              )}} component={Track} />  
              <HomeTab.Screen name="Meal" options = {{headerShown: false, tabBarLabel: "Meal Prep", tabBarIcon: ({color, size}) => (
                <Ionicons name="fast-food" size={size} color={color} />
              )}} component={Meal} />
            </HomeTab.Navigator>
          </NavigationContainer>
      ) : (
        <NavigationContainer>
          <AuthStack.Navigator>
              <AuthStack.Screen name='Landing' options={{headerTitle: "", headerStyle: {backgroundColor: primary}}} component={Landing} />
              <AuthStack.Screen name='Login'  options={{headerTitle: "", headerStyle: {backgroundColor: primary}}} component={Login} />
              <AuthStack.Screen name='Register'  options={{headerTitle: "", headerStyle: {backgroundColor: primary}}} component={Register} />
          </AuthStack.Navigator>
        </NavigationContainer>
      )}
    </>
  )
}
