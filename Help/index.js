import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, Button, Image, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker';

import styles from './styles'
import { DATA_URL, API_KEY } from '../url.js';
const Image_URL = 'https://imageuploader.luis-dati.repl.co/'

const Help = ({ navigation }) => {
	const [image, setImage] = useState(null);
	const [name, setName] = useState('');
	const [sdt, setSdt] = useState('');
	const [feed, setFeed] = useState('');
	const [school, setSchool] = useState('');

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		const result = await ImagePicker.launchImageLibraryAsync({
		  	mediaTypes: ImagePicker.MediaTypeOptions.Images,
		  	allowsEditing: true,
		  	aspect: [2, 4],
		  	quality: 1,
		});

		if (!result.cancelled) {
		  	setImage(result.uri);
		}
	};

	async function CheckAgain(){
		if (name == '' || sdt == '' || feed == '' || school == '') {
			Alert.alert('Thông báo','Bạn phải nhập đầy đủ thông tin')
		} else {
			await handleSubmit()
		}
	}

	async function handleSubmit() {
		const param = {
			name: name,
			sdt: sdt,
			feed: feed,
			school: school
		}

		const response1 = await fetch(DATA_URL+'feedback', {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json',
	      'api-key': API_KEY,
	    },
	    body: JSON.stringify(param),
	  });
		
	  const uploadImage = async (uri) => {
		  let formData = new FormData();
		  formData.append('image', {
		    uri,
		    name: name+sdt+school+'.jpg',
		    type: 'image/jpg',
		  });

		  const response = await fetch(Image_URL+'upload', {
		    method: 'POST',
		    body: formData,
		    headers: {
		      'Content-Type': 'multipart/form-data',
		    },
		  });

		  return response.status
		};
		
		let response2;

		if (image) {
			response2 = await uploadImage(image)	
		} else {
			response2 = 200
		}

	  if (response1.status == 200 && response2 == 200) {
	  	setName('');setSdt('');setFeed('');setImage(null);setSchool('')
	  	Alert.alert('Thông báo','Gửi phản hồi thành công. Chúng tôi sẽ trả lời bạn trong vài ngày tới',[
	      {text: 'OK', onPress: () => navigation.push('Home')}
	    ])
	  } else {
	  	Alert.alert('Gửi phản hồi thất bại')
	  }
		
	}
	
	return (
		<View style={styles.container}>
			<ScrollView style={{padding:15}}>
				<View style={styles.boxName}>
	 				<Text style={[styles.qsTxt,{marginRight:10}]}>Bạn tên là</Text>
	 				<TextInput
	 					value={name}
	 					onChangeText={value => setName(value)} 
	 					style={styles.inputBox}/>
	 			</View>
	 			<View style={styles.boxName}>
	 				<Text style={[styles.qsTxt,{marginRight:10}]}>Đơn vị trường</Text>
	 				<TextInput
	 					value={school}
	 					onChangeText={value => setSchool(value)} 
	 					style={styles.inputBox}/>
	 			</View>
	 			<View style={styles.boxName}>
	 				<Text style={[styles.qsTxt,{marginRight:10}]}>Số điện thoại</Text>
	 				<TextInput
	 					value={sdt}
	 					onChangeText={value => setSdt(value)} 
	 					style={styles.inputBox}/>
	 			</View>
	 			<View style={{flexDirection:'column',borderWidth:0.7,padding:10}}>
	 				<Text style={[styles.qsTxt,{marginBottom:10}]}>Hãy mô tả chi tiết vấn đề mà bạn gặp phải</Text>
	 				<TextInput
	 					value={feed}
	 					onChangeText={value => setFeed(value.replace("\n",''))} 
	 					multiline={true} style={styles.demandInputBox}/>
	 				<View style={{alignItems:'center',flex:1}}>
		 				<Button title="Chọn ảnh từ thiết bị" onPress={pickImage} />
		 				{image && <Image source={{ uri: image }} style={{width:100,height:200,margin:10}}/>}
		 			</View>
	 			</View>

			</ScrollView>
			<View style={{padding:10,backgroundColor: 'rgba(0, 0, 0, 0)'}}>
				<Button title='Gửi' onPress={CheckAgain}/>	
			</View>
				
		</View>
		
	)
}

export default Help