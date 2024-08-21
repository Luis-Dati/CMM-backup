import * as React from 'react';
import { Dimensions, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Home } from './Home/index';
import DrawerContent from './Drawer/index';
import Main from './Main/index';
import User from './User/index';
import Grade from './Grade/index';
import Model from './User/Model/index';
import Help from './Help/index';
import Class from './Class/index';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

let deviceWidth = Dimensions.get('window').width

const Headder = ({ name }) => {
	const navigation = useNavigation();
	return (
		<View style={{backgroundColor:'blue',borderWidth:1}}>
			<View style={{height:45,width:'100%'}}></View>
			<View style={{flexDirection:'row',alignItems:'center'}}>
				<TouchableOpacity
				style={{paddingVertical:10,paddingHorizontal:15}}
				onPress={() => navigation.toggleDrawer()}
				>
					<MaterialCommunityIcons name="menu" size={25} />
				</TouchableOpacity>
				<View style={{justifyContent:'center',width:'40%',alignItems:'center'}}>
					<Text style={{fontWeight:'bold',fontSize:21}}>{name}</Text>
				</View>	
			</View>

		</View>
	)
}

const HomeScreen = ({route, navigation }) => {
	let { item }= route.params;
	return (
		<Stack.Navigator 
			screenOptions={{
				headerTitleAlign:'center',
				headerStyle: {
          backgroundColor: '#1FBFF4',
        },
        headerTitleStyle: {
        	fontWeight: 'bold',
        	color:'white',
        },
        headerTintColor: '#fff',
		}}>
			<Stack.Screen 
				name="Home" component={Home} 
				options={({navigation, route}) =>({	
					title: 'Trang chủ',
					headerLeft: () => (
      			<TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
      				<MaterialCommunityIcons name='menu' size={25} color='#FFF'/>	
      			</TouchableOpacity>
    			)
				})}
				initialParams={{item: item}}
			/>
			<Stack.Screen name="Grade" component={Grade} options={({ route }) => ({ title: route.params.grade })}/>
			<Stack.Screen name="Main" component={Main} options={({ route }) => ({ title: route.params.className })}/>
		</Stack.Navigator>
 	)
}

const UserScreen = ({ navigation }) => {
	
	return (
		<Stack.Navigator 
			screenOptions={{
				headerTitleAlign:'center',
				headerStyle: {
          backgroundColor: '#1FBFF4',
        },
        headerTitleStyle: {
        	fontWeight: 'bold',
        	color:'white',
        },
        headerTintColor: '#fff',
		}}>
			<Stack.Screen name="Empty" component={Empty}/>
			<Stack.Screen 
				name="User" component={User} 
				options={({navigation, route}) =>({
					title: 'Cá nhân',
					headerLeft: () => (
      			<TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
      				<MaterialCommunityIcons name='menu' size={25} color='#FFF'/>	
      			</TouchableOpacity>
    			)
				})}
			/>
			<Stack.Screen 
				name="Model" component={Model} 
				options={({ route }) => ({title: route.params.type})}
			/>
			<Stack.Screen name="Class" component={Class} options={({ route }) => ({ title: 'Lớp ' + route.params.class })}/>
		</Stack.Navigator>
	)
}

const Empty = () => {
	return (
		<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
			<Text>Phiên bản: 2.0.0</Text>
			<Text>Bản quyền thuộc sở hữu của Lê Duy Đạt (313615)</Text>
		</View>
	)
}

const TotalScreen = ({ navigation }) => {
	const [login, setLogin] = React.useState(null);

  const getItems = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('UserIn4');
      // return jsonValue != null ? JSON.parse(jsonValue) : {};
      if (jsonValue !== null) {
        jsonValue = JSON.parse(jsonValue)
        setLogin(jsonValue.user_role)
      }
    } catch (e) {
      // error reading value
    }

  };
  
  getItems()

	return (
		<Drawer.Navigator
			drawerContent={(props) => <DrawerContent {...props}/>}
			screenOptions={{headerTitleAlign:'center'}}
		>
			<Drawer.Screen
				name="HomeScreen" 
				component={HomeScreen} 
				options={{headerShown:false,title:'Trang chủ'}}
			/>
			<Drawer.Screen
				name='Help'
				component={Help}
				options={{title:'Trợ giúp'}}
			/>
			<Drawer.Screen
				name='Information'
				component={Empty}
				options={{title:'Thông tin phần mềm'}}
			/>
			{login
			&& (
					<Drawer.Screen 
						name="UserScreen" 
						component={UserScreen} 
						options={{headerShown:false,title:'Cá nhân',drawerItemStyle:{display:'none'}}} 
					/>	
				)
			}
		</Drawer.Navigator>
	)
}

export { TotalScreen };