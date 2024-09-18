import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import Loading from './Loading/index'
import Register from './Register/index'
import { TotalScreen } from './TotalScreen'

const Stack = createNativeStackNavigator();

const theme = {
	...DefaultTheme,
	colors: {
		"primary": "rgb(120, 69, 172)",
		"onPrimary": "rgb(255, 255, 255)",
		"primaryContainer": "rgb(240, 219, 255)",
		"onPrimaryContainer": "rgb(44, 0, 81)",
		"secondary": "rgb(102, 90, 111)",
		"onSecondary": "rgb(255, 255, 255)",
		"secondaryContainer": "rgb(237, 221, 246)",
		"onSecondaryContainer": "rgb(33, 24, 42)",
		"tertiary": "rgb(128, 81, 88)",
		"onTertiary": "rgb(255, 255, 255)",
		"tertiaryContainer": "rgb(255, 217, 221)",
		"onTertiaryContainer": "rgb(50, 16, 23)",
		"error": "rgb(186, 26, 26)",
		"onError": "rgb(255, 255, 255)",
		"errorContainer": "rgb(255, 218, 214)",
		"onErrorContainer": "rgb(65, 0, 2)",
		"background": "rgb(255, 251, 255)",
		"onBackground": "rgb(29, 27, 30)",
		"surface": "rgb(255, 251, 255)",
		"onSurface": "rgb(29, 27, 30)",
		"surfaceVariant": "rgb(233, 223, 235)",
		"onSurfaceVariant": "rgb(74, 69, 78)",
		"outline": "rgb(124, 117, 126)",
		"outlineVariant": "rgb(204, 196, 206)",
		"shadow": "rgb(0, 0, 0)",
		"scrim": "rgb(0, 0, 0)",
		"inverseSurface": "rgb(50, 47, 51)",
		"inverseOnSurface": "rgb(245, 239, 244)",
		"inversePrimary": "rgb(220, 184, 255)",
		"elevation": {
			"level0": "transparent",
			"level1": "rgb(248, 242, 251)",
			"level2": "rgb(244, 236, 248)",
			"level3": "rgb(240, 231, 246)",
			"level4": "rgb(239, 229, 245)",
			"level5": "rgb(236, 226, 243)"
		},
		"surfaceDisabled": "rgba(29, 27, 30, 0.12)",
		"onSurfaceDisabled": "rgba(29, 27, 30, 0.38)",
		"backdrop": "rgba(51, 47, 55, 0.4)",
		"lighterOwnColor": "rgb(0, 99, 154)",
		"onLighterOwnColor": "rgb(255, 255, 255)",
		"lighterOwnColorContainer": "rgb(206, 229, 255)",
		"onLighterOwnColorContainer": "rgb(0, 29, 50)",
		"ownColor": "rgb(0, 102, 133)",
		"onOwnColor": "rgb(255, 255, 255)",
		"ownColorContainer": "rgb(191, 233, 255)",
		"onOwnColorContainer": "rgb(0, 31, 42)"
	}
}

export default function App() {
	const colorScheme = useColorScheme();

	const paperTheme =
	colorScheme === 'light'
		? { ...theme }
		: { ...theme };

	return (
	<PaperProvider theme={paperTheme}>
		<StatusBar animated translucent={true} style='light'/>
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name='Loading' component={Loading} options={{headerShown:false}}/>
				<Stack.Screen name='TotalScreen' component={TotalScreen} options={{headerShown:false}}/>
				<Stack.Screen name='Register' component={Register} options={{title:'Đăng kí'}}/>
			</Stack.Navigator>
		</NavigationContainer>
	</PaperProvider>
	);
}

