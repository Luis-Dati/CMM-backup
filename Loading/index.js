import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar, KeyboardAvoidingView, Animated, Dimensions, Keyboard, Alert, ImageBackground, Image, TouchableOpacity, View, Text, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { Button, Menu, Divider, PaperProvider, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import styles from './styles'; 
import { DATA_URL, API_KEY } from '../url.js';

let deviceWidth = Dimensions.get('window').width;
import CryptoES from "crypto-es";

function DecryptPass (code, key) {
	let bytes = CryptoES.AES.decrypt(code, key);
	return bytes.toString(CryptoES.enc.Utf8);
}

const Loading = ({navigation}) => {
	const [isFocused, setIsFocused] = useState(false);
	const [isFocused2, setIsFocused2] = useState(false);

	const [name, setName] = useState('');
	const [pass, setPass] = useState('');
	const [data, setData] = useState([])
	const [visible, setVisible] = useState(false);
	const [role, setRole] = useState('')
	const [school, setSchool] = useState(null)
	const [userIn4, setUserIn4] = useState(null)

	const schools = [
		{id:'THPT Dầu Tiếng',item:'THPT Dầu Tiếng'}
	]

	const getItems = async () => {
		try {
			let jsonValue = await AsyncStorage.getItem('UserIn4');
			let jsonValue2 = await AsyncStorage.getItem('UserSchool');
			// return jsonValue != null ? JSON.parse(jsonValue) : {};
			if (jsonValue && jsonValue2) {
				jsonValue = JSON.parse(jsonValue)
				setUserIn4(jsonValue)
				setName(jsonValue.user_role)
				setSchool({id:jsonValue2,item:jsonValue2})
				
				if (jsonValue.user_role.includes('sdl')) {
					setRole('Sao đỏ')
				} else {
					setRole('Admin')
				}

			}
		} catch (e) {
			// error reading value
			
		}

	};

	useEffect(() => {
		getItems()
		fetchData()
	},[])

	const storeData = async (value) => {
		try {
			const roleValue = value.user_role;
			const userValue = JSON.stringify(value);
			
			const firstPair = ['UserIn4', userValue]
			const secondPair = ['UserRole', roleValue]
			const thirdPair = ['UserSchool', school.item]
			await AsyncStorage.multiSet([firstPair,secondPair,thirdPair])
		} catch (e) {
			// saving error
		}
	};

	//animation
	const zoomOut = {
		0: {
			opacity: 1,
			scale: deviceWidth/100*0.85,
		},
		0.5: {
			opacity: 1,
			scale: deviceWidth/100*0.7,
		},
		1: {
			opacity: 1,
			scale: deviceWidth/100*0.5,
		},
	};
	const moveValue = useRef(new Animated.ValueXY({x:0,y:0})).current;
	useEffect(() => {
		Animated.timing(moveValue, {
			toValue: {
				x:0, 
				y:-100
			},
			duration:3000,
			delay:3000,
			useNativeDriver:false
		}).start();
	}, [moveValue]);

	const fontSzValue = useRef(new Animated.Value(5)).current;
	useEffect(() => {
		Animated.timing(fontSzValue, {
			toValue:0.7,
			duration:3000,
			delay:3000,
			useNativeDriver:false
		}).start();
	}, [fontSzValue]);

	const fadeValue = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		Animated.timing(fadeValue, {
			toValue: 1,
			duration: 3000,
			delay:4000,
			useNativeDriver: false
		}).start();
	}, [fadeValue]);	

	// handle something
	const fetchData = async () => {
		try {
			const response = await fetch(DATA_URL+'userall', {
				method: 'GET',
				headers: {
					'api-key': API_KEY,
				}
			});
			const jsonData = await response.json();
			jsonData.map(obj=>obj.password = DecryptPass(obj.password, obj.user_role))
			setData(jsonData);
		} catch (error) {
			
		}
	};

	async function LoginCheck () {
		if (!school) {
			Alert.alert('Thông báo','Bạn chưa nhập tên trường')
			return
		}

		if (school.item != 'THPT Dầu Tiếng') {
			Alert.alert('Thông báo','Trường chưa đăng kí dữ liệu')
		} else {
			if (role == '') {
				Alert.alert('Thông báo','Bạn chưa chọn vai trò đăng nhập')
				return
			}

			if (role == 'Người dùng khác') {
				navigation.replace('TotalScreen', {
					screen:'HomeScreen',
					params:{item: school.item}
				})
				return
			}

			if (role != 'Người dùng khác') {
				Keyboard.dismiss();	
				let user;
				if (name == '') {
					Alert.alert('Thông báo','Bạn chưa nhập đầy đủ thông tin')
					return
				}
				
				user = data.find((item)=>(item.user_role == name && item.password == pass)) 
				
				if (user) {
					await storeData(user)	
					
					Alert.alert('Thông báo','Đăng nhập thành công')
					navigation.replace('TotalScreen', {
						screen:'HomeScreen',
						params:{item: school.item}
					})
				} else {
					Alert.alert('Thông báo','Đăng nhập thất bại')
				}

			}
		}		
	}

	function closeMenu (item) {
		setRole(item)
		setVisible(false)
	}

	return (
  <PaperProvider>
		<LinearGradient
			colors={['#7579ff', '#24E8EF']}
			style={{flex:1, opacity:0.85, justifyContent:'center', alignItem:'center'}}
		>
			<Animated.View style={[styles.form,{marginTop:moveValue.y, marginLeft:moveValue.x}]}>
				<Animatable.View animation={zoomOut} delay={2000}>
					<Image source={require('../assets/OfficalLogo.png')} style={{width: 50, height: 50}}/>
				</Animatable.View>
			</Animated.View>

			<Animated.View style={[styles.form,{opacity:fadeValue,top:70}]}>	
				<KeyboardAvoidingView behavior='height' 
					keyboardVerticalOffset={50}
				>
				<View style={{width:300}}>
					<View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:-10}]}>
						<Text style={styles.textForm}>Bạn đến từ trường</Text>
						
					<Dropdown
	          style={[styles.dropdown]}
	          iconStyle={{height:30,width:30}}
	          data={schools}
	          search
	          maxHeight={250}
	          labelField="item"
	          valueField="id"
	          placeholder={school ? school.item : 'Chọn 1 trường'}
	          placeholderStyle={{color:'white',fontWeight:'bold'}}
	          selectedTextStyle={{color:'white',fontWeight:'bold'}}
	          searchPlaceholder="Tìm kiếm..."
	          value={school}
	          onChange={item => setSchool(item)}
	        />	
					</View>

					<View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}]}>
						<Text style={styles.textForm}>Bạn đăng nhập với tư cách</Text>
						<Menu
		          visible={visible}
		          onDismiss={()=>setVisible(false)}
		          anchor={
		          	<Button 
		          		mode={role == '' ? 'contained' : 'outlined'} 
		          		style={{borderRadius:5}} 
		          		labelStyle={{fontSize:17,color:'white',fontWeight:'bold',marginHorizontal:5}} 
		          		onPress={()=>setVisible(true)}
								>
									{role == '' ? 'Chọn' : role}
								</Button>}>
		          <Menu.Item onPress={() => closeMenu('Admin')} title="Admin" />
		          <Divider bold={true} />
		          <Menu.Item onPress={() => closeMenu('Sao đỏ')} title="Sao đỏ" />
		          <Divider bold={true} />
		          <Menu.Item onPress={() => {closeMenu('Người dùng khác');setName('');setPass('')}} title="Người dùng khác" />
		        </Menu>
					</View>	
				</View>
				</KeyboardAvoidingView>

				
				{/*<View style={[styles.boxQs,(role == 'Người dùng khác' || userIn4) && {backgroundColor:'#AAAAAA',opacity:0.5}]}>
					<MaterialCommunityIcons name="account" size={25} color='white'/>
					<TextInput
						onChangeText={value => setName(value.replace(/\s+|,|-|[.]/g,''))}
						value={name}
						style={styles.textForm}
						placeholderTextColor='white'
						selectionColor={'white'}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						placeholder={isFocused ? '' : 'Tên tài khoản'}
						editable={role == 'Người dùng khác' || userIn4 ? false : true}
					/>
				</View>
					
				<View style={[styles.boxQs,role == 'Người dùng khác' && {backgroundColor:'#AAAAAA',opacity:0.5}]}>
					<MaterialCommunityIcons name="lock" size={25} color='white'/>
					<TextInput
						onChangeText={setPass}
						value={pass}
						style={styles.textForm}
						placeholderTextColor='white'
						secureTextEntry={true}
						onFocus={() => setIsFocused2(true)}
						onBlur={() => setIsFocused2(false)}
						selectionColor={'white'}
						placeholder={isFocused2 ? '' : 'Mật khẩu'}
						editable={role == 'Người dùng khác' ? false : true}
					/>
				</View>*/}
				<View style={{width:'80%',maxWidth:200}}>
					<TextInput
						mode='outlined'
			      label="Tài khoản"
			      onChangeText={value => setName(value.replace(/\s+|,|-|[.]/g,''))}
						value={name}
						placeholderTextColor='white'
						selectionColor={'white'}
						cursorColor='white'
						disabled={role == 'Người dùng khác' || userIn4 ? true : false}
			      left={<TextInput.Icon icon="account" color='white'/>}
			      textColor='white'
			      theme={{ colors: { background: '#69B6F7' } }}
			      activeOutlineColor='#fff'
			    />
					<TextInput
						mode='outlined'
			      label="Mật khẩu"
			      onChangeText={setPass}
						value={pass}
						placeholderTextColor='white'
						secureTextEntry
						selectionColor={'white'}
						cursorColor='white'
						disabled={role == 'Người dùng khác' ? true : false}
			      left={<TextInput.Icon icon="lock" color='white'/>}
			      textColor='white'
			      theme={{ colors: { background: '#63BDF6' } }}
			      activeOutlineColor='#fff'
			    />
			  </View>

				<Pressable
					onPress={LoginCheck}
					style={({ pressed }) => [
					{
							backgroundColor: pressed
								? '#5A7EE6'
								: 'white'
						},
						styles.loginBtn
					]}>
					{({pressed}) => (
							pressed
							? <Text style={{color:'white',fontWeight:'bold',fontSize:16}}>Đăng nhập</Text>
						: <Text style={{color:'#555',fontWeight:'bold',fontSize:16}}>Đăng nhập</Text>
					)}
				</Pressable>

				<View style={[{postion:'absolute',top:50,justifyContent:'center',alignItems:'center',}]}>
					{userIn4 == null
					&& (
						<>
							<Text style={styles.regisTxt}>
								Hoặc đăng kí nếu trường của bạn chưa có trong dữ liệu của chúng tôi
							</Text>
							<TouchableOpacity onPress={()=>navigation.navigate('Register')} style={[styles.loginBtn,{backgroundColor:'green'}]}>
								<Text style={{color:'white',fontWeight:'bold',fontSize:16}}>Đăng kí</Text>
							</TouchableOpacity>
						</>
						)

					}
					
				</View>
			</Animated.View>	
			
		</LinearGradient>
	</PaperProvider>
	)
}

export default Loading