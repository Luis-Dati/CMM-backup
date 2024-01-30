import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loading from './Loading/index'
import Register from './Register/index'
import { TotalScreen } from './TotalScreen'

const Stack = createNativeStackNavigator();

export default function App() {

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name='Loading' component={Loading} options={{headerShown:false}}/>
				<Stack.Screen name='TotalScreen' component={TotalScreen} options={{headerShown:false}}/>
				<Stack.Screen name='Register' component={Register} options={{title:'Đăng kí'}}/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

