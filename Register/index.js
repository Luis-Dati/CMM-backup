import React, { useState } from 'react';
import { Button, Image, View, Text, ScrollView, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import styles from './styles';
import { DATA_URL, API_KEY } from '../url.js';
const Image_URL = 'https://imageuploader.luis-dati.repl.co/'

const Register = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [sdt, setSdt] = useState('');
  const [addr, setAddr] = useState('');
  const [school, setSchool] = useState('');

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets);
    }
  };

	async function CheckAgain(){
		if (name == '' || sdt == '' || addr == '' || school == '') {
			Alert.alert('Thông báo','Bạn phải nhập đầy đủ thông tin')
		} else {
			await handleSubmit()
		}
	}

	async function handleSubmit() {
		const param = {
			name: name,
			sdt: sdt,
			address: addr,
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
		    name: name+sdt+school+'addr.jpg',
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
	  	setName('');setSdt('');setAddr('');setImage(null);setSchool('')
	  	Alert.alert('Thông báo','Gửi yêu cầu thành công. Chúng tôi sẽ trả lời bạn trong vài ngày tới',[
	      {text: 'OK', onPress: () => navigation.navigate('Loading')}
	    ])
	  } else {
	  	Alert.alert('Gửi yêu cầu thất bại')
	  }
		
	}

  return ( 
    <ScrollView style={styles.container}>
   		<View style={styles.boxName}>
 				<Text style={[styles.qsTxt,{marginRight:10}]}>Bạn tên là</Text>
 				<TextInput
          value={name}
          onChangeText={value => setName(value)} 
          style={styles.inputBox}
         />
 			</View>
 			<View style={styles.boxName}>
 				<Text style={[styles.qsTxt,{marginRight:10}]}>Đơn vị trường</Text>
 				<TextInput
          value={school}
          onChangeText={value => setSchool(value)} 
          style={styles.inputBox}
         />
 			</View>
 			<View style={styles.boxName}>
 				<Text style={[styles.qsTxt,{marginRight:10}]}>Số điện thoại</Text>
 				<TextInput
          value={sdt}
          onChangeText={value => setSdt(value)} 
          style={styles.inputBox}
         />
 			</View>
 			<View style={styles.boxName}>
 				<Text style={[styles.qsTxt,{marginRight:10}]}>Địa chỉ</Text>
 				<TextInput
          value={addr}
          onChangeText={value => setAddr(value)} 
          style={styles.inputBox}
         />
 			</View>
 			<View style={styles.boxName}>
 				<Text style={[styles.qsTxt,{marginRight:10}]}>Ảnh CCCD</Text>
	 			<View style={{alignItems:'center',flex:1}}>
	 				<Button title="Chọn ảnh từ thiết bị" onPress={pickImage} />
	 				{image && <Image source={{ uri: image }} style={{ width: 200, height: 200, margin:10 }} />}
	 			</View>
	 				
 			</View>
      
      <Button title='Gửi' onPress={CheckAgain}/>
      <View style={{height:30}} />
    </ScrollView>
  );
}

export default Register