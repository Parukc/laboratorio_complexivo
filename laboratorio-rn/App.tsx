import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LabTestsScreen from "./src/screens/LabTestsScreen";
import LabOrdersScreen from "./src/screens/LabOrdersScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  LabTests: undefined;
  LabOrders: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Laboratorio" }} />
        <Stack.Screen name="LabTests" component={LabTestsScreen} options={{ title: "Pruebas" }} />
        <Stack.Screen name="LabOrders" component={LabOrdersScreen} options={{ title: "Órdenes" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}