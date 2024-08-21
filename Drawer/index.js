import React, { useEffect, useState } from 'react';
import { Alert, StatusBar, Modal, View, Pressable, Text, ImageBackground, Button} from 'react-native';
import { Snackbar, TextInput } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItemList, DrawerItem, useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { login } from '../Home/index';
import { UserScreen } from '../TotalScreen';
import styles from './styles';
import DATA_URL from '../url.js'

// const DATA_URL = 'https://realistic.luis-dati.repl.co/'
import CryptoES from "crypto-es";

function EncryptPass (pass, key) {
	return CryptoES.AES.encrypt(pass, key).toString();	
}

export default function DrawerContent(props) {
	const [modal, setModal] = useState(false)
	const [oldPass, setOldPass] = useState('')
	const [newPass, setNewPass] = useState('')
	const [newPassAg, setNewPassAg] = useState('')
	const navigation = useNavigation()
	const [login, setLogin] = useState(null);
	const [userIn4, setUserIn4] = useState(null)
	const [snackView, setSnackView] = useState(false);
	const [snackMessage, setSnackMessage] = useState('');
	const [eyeNew, setEyeNew] = useState(true)
	const [eyeOld, setEyeOld] = useState(true)	

	if (snackView) {
		setTimeout(() => setSnackView(false), 5000)
	}

  const getItems = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('UserIn4');
      // return jsonValue != null ? JSON.parse(jsonValue) : {};
      if (jsonValue !== null) {
        jsonValue = JSON.parse(jsonValue)
        setUserIn4(jsonValue)
        setLogin(jsonValue.user_role)
      }
    } catch (e) {
      // error reading value
    }
    
  };

	const isDrawer = useDrawerStatus();

  const clearAll = async () => {
	  try {
	    await AsyncStorage.clear()
	  } catch(e) {
	    // clear error
	  }
	  navigation.navigate('Loading')	
	};

  useEffect(() => {
    getItems();
  }, []);

  function snackPopUp (message) {
  	setSnackMessage(message)
  	setSnackView(true)
  }

  async function changePass () {
  	if (oldPass == '' || newPass == '' || newPassAg == '') {
  		snackPopUp('Bạn chưa nhập đầy đủ dữ liệu')
  		return
  	}
  	if (oldPass != userIn4.password) {
  		snackPopUp('Bạn nhập sai mật khẩu cũ')
  		return
  	}
  	if (newPass != newPassAg) {
  		snackPopUp('Mật khẩu mới không khớp')
  		return
  	}
  	
		setNewPass('')
		setOldPass('')
		setNewPassAg('')
		setModal(false)

  	let param = {
  		user_id: userIn4.user_id,
  		password: EncryptPass(newPass, userIn4.user_role),
  		user_role: userIn4.user_role,
  		user_class: userIn4.user_class,
  	}

		const response = await fetch(DATA_URL+'user', {
	    method: 'PUT',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	    body: JSON.stringify(param),
	  });

	  if (response.status === 200) {
	    Alert.alert('Thông báo','Thay đổi mật khẩu thành công!')
	    param.password = newPass
	    const userValue = JSON.stringify(param)
			await AsyncStorage.setItem('UserIn4',userValue)
			await getItems()
	  } else {
	    Alert.alert('Thông báo','Thay đổi mật khẩu đã thất bại!')
	  }	

  }

	return (
    	<DrawerContentScrollView {...props}>
      		{login 
      		?   (	
      				<View>
      					<ImageBackground 
		  						source={require('../assets/bluebackground.jpg')}
		  						resizeMode="cover" style={styles.container}
		  					>
		  						<Pressable 
		  							style={styles.imgBox} 
		  							onPress={()=>navigation.navigate('UserScreen',{screen:'User',params:{login:login,loginIn4:userIn4}})}
		  						>
		  							<MaterialCommunityIcons name={login.includes('sdl') ? 'account-star' : 'account-cog'} size={40} color='white'/>
		  						</Pressable>
		  						<Text style={styles.usrTxt}>{login.includes('sdl') ? 'Sao đỏ '+login.slice(3) : login}</Text>
		  						<View style={{height:10}} />
		  						<Button title='Đổi mật khẩu' onPress={()=>{setModal(true);setOldPass('');setNewPass('');setNewPassAg('')}} color='#27A027'/>
		  						<Modal
										animationType='fade'
										transparent={true}
										visible={modal}
									>
										<View style={[styles.entireView,{justifyContent:'center',alignItems:'center'}]}>
											<View style={styles.dialog}>
												<Pressable 
													onPress={()=>{setModal(false);setOldPass('');setNewPass('');setNewPassAg('')}}
													style={{alignSelf:'flex-end'}}
												>
													<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
												</Pressable>
												<View style={styles.changePass}>
	                        <TextInput
	                        	mode='outlined'
											      label="Tên tài khoản"
											      value={login}
											      disabled={true}
											    /> 
			  									<TextInput
			  										maxLength={20}
			  									  mode='outlined'
											      label="Mật khẩu cũ"
											      secureTextEntry={eyeOld}
											      value={oldPass}
											      onChangeText={text => setOldPass(text)}
											      right={<TextInput.Icon icon={eyeOld ? "eye-off" : "eye"} onPress={()=>setEyeOld(!eyeOld)} />}
											    />
											    <TextInput
											    	maxLength={20}
											    	mode='outlined'
											      label="Mật khẩu mới"
											      secureTextEntry={eyeNew}
											      value={newPass}
											      onChangeText={text => setNewPass(text)}
											      right={<TextInput.Icon icon={eyeNew ? "eye-off" : "eye"} onPress={()=>setEyeNew(!eyeNew)} />}
											    />
											    <TextInput
											    	maxLength={20}
											    	mode='outlined'
											      label="Nhập lại mật khẩu mới"
											      secureTextEntry={eyeNew}
											      value={newPassAg}
											      onChangeText={text => setNewPassAg(text)}
											    />
											    <Button title='Thay đổi' onPress={changePass}/>
											  </View>
		  								</View>
		  							</View>
		  							<Snackbar
								      visible={snackView}
								      onDismiss={()=>setSnackView(false)}
								     >
								      {snackMessage}
								    </Snackbar>
		  						</Modal>
		  					</ImageBackground>

		  					<DrawerItemList {...props} />
		  					<DrawerItem
				        		label="Đăng xuất"
				        		onPress={clearAll}
			      		/>
      				</View>
  					     				
      			) 
      		: 
	      		(
	      			<View>
	      				<View style={{alignItems:'center'}}>
		    				<Text style={styles.wclTxt}>Hãy đăng nhập để tiếp tục công việc của bạn</Text>		
		    			</View>
	      				<DrawerItemList {...props} />
	    				<DrawerItem
			      			// icon={({ focused, color, size }) => <MaterialCommunityIcons color={color} size={size} name={focused ? 'heart' : 'heart-outline'} />}
			        		label="Đăng kí"
			        		onPress={()=>navigation.navigate('Register')}
			      		/>
	      			</View>			
	      		)

      		}
      		{/*<DrawerItem
      			// icon={({ focused, color, size }) => <MaterialCommunityIcons color={color} size={size} name={focused ? 'heart' : 'heart-outline'} />}
        		label="Trợ giúp"
        		onPress={()=>navigation.navigate('Help')}
      		/>*/}
      	
    	</DrawerContentScrollView>
	)
}