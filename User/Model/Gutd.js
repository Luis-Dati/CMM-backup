import React, { useState, useEffect } from 'react'
import { FlatList, View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Button, ActivityIndicator, Alert } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NumericInput from 'react-native-numeric-input';
import { RadioButton } from 'react-native-paper';
import * as RNPaper from 'react-native-paper';

import styles from './styles';
import DATA_URL from '../../url.js'

const Gutd = () => {
	const [gutd, setGutd] = useState(null);
	const [view, setView] = useState('none');
	const [right, setRight] = useState(0)
	const [modal, setModal] = useState(false)
	const [modal2, setModal2] = useState(false)
	const [signal, setSignal] = useState(false)
	const [choice, setChoice] = useState('all');
	const [isPress, setPress] = useState(false)

	const [nvp, setNvp] = useState('')
	const [nscore, setNscore] = useState(0)
	const [idChange, setIdChange] = useState('')

	const fetchData = async () => {
    try {
      const response = await fetch(DATA_URL+'rules');
      const jsonData = await response.json();
      setGutd(jsonData);
    } catch (error) {
      
    }
  };

  useEffect(() => {
  	fetchData()
  }, [signal])

	const handleDel = async (item,index) => {
		let option={
			method:"DELETE",
		};

		await fetch(DATA_URL+"rules/"+item.name_vp_id,option)
			.then((res)=>{
				if (res.ok) {
					Alert.alert('Thông báo','Xóa thành công',[
						{text:'Ok',onPress:()=>setSignal(item.name_vp_id)}
					])
				}
			})
			.catch((res)=>Alert.alert('Xóa thất bại'))
	}

	const HandleChange = async (item) => {
		let vpm = {
			name_vp_id: idChange,
			name_vp: nvp,
			minus_pnt: nscore,
		}

		setModal2(false)
		setNvp('')
		setNscore(0)
		setIdChange('')

		let option = {
			method:"PUT",
			headers: {
				'Accept': 'application/json',
				"Content-Type":"application/json",
			},
			body: JSON.stringify(vpm)
		};
		await fetch(DATA_URL+"rules",option)
			.then((res)=>{
				if (res.ok) {
					Alert.alert('Thông báo','Chỉnh sửa thành công',[
						{text:'Ok',onPress:()=>setSignal(vpm)}
					])
				}
			})
			.catch((res)=>Alert.alert('Chỉnh sửa thất bại'))			
	}

	const HandleAdd = async () => {	
		let idRecent;
		if (gutd.length == 0) {
			idRecent = 0
		} else {
			idRecent = gutd.length;	
		}
		let num = 'rl' + (idRecent + 1)
		let vpm = {
			name_vp:nvp,
			minus_pnt:nscore,
		};

		let Multi = gutd.filter((item)=>item.name_vp == vpm.name_vp)
		if (Multi.length != 0) {
			Alert.alert('Thông báo','Vi phạm đã xuất hiện')
		} else {
			setModal(false);setGutd([...gutd, vpm])
			setNvp('');setNscore(0)

			let option = {
				method:"POST",
				headers: {
					'Accept': 'application/json',
					"Content-Type":"application/json",
				},
				body: JSON.stringify(vpm)
			};
			await fetch(DATA_URL+"rules",option)
				.then((res)=>{
					if (res.ok) {
						Alert.alert('Thông báo','Thêm thành công',[
							{text:'Ok',onPress:()=>setSignal(vpm)}
						])
					}
				})
				.catch((res)=>Alert.alert('Thêm thất bại'))
			}

	}

	return (
		<View style={{flex:1}}>
			<Text style={styles.header}>Bảng các loại vi phạm</Text>			

			<FlatList
				contentContainerStyle={{margin:5}}
				ListHeaderComponent={
					<View style={{flexDirection:'row',marginRight:right}}>
						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.25}]}>STT</Text>
						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Tên vi phạm</Text>
						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.8}]}>Điểm trừ/cộng</Text>				
					</View>
				}
        data={gutd}
        renderItem={({item, index}) => (
        	<>
		        <TouchableOpacity 
							style={{flexDirection:'row'}} 
							onPress={()=>{
								setModal2(true);setIdChange(item.name_vp_id);
								setNvp(item.name_vp);setNscore(item.minus_pnt)
							}}
						>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.25}]}>{index+1}</Text>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.name_vp}</Text>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.8}]}>{item.minus_pnt}</Text>
							<TouchableOpacity onPress={()=>handleDel(item,index)} style={[{alignItems:'center',justifyContent:'center'},{display:view}]}>
								<MaterialCommunityIcons name='delete-forever' color='black' size={30} />
							</TouchableOpacity>
						</TouchableOpacity>
					</>
        )}
        keyExtractor={(item, idx) => item.name_vp_id+idx}
        ListFooterComponent={
      		<View style={{height:50}} />  	
        }
        ListEmptyComponent={
        	<View>
						<Text>Chưa có vi phạm</Text>
						<ActivityIndicator size="large" />
					</View>	
        }
      />

			<Modal
				animationType='fade'
				transparent={true}
				visible={modal2}
			>
				<View style={styles.entireView}>
					<ScrollView style={styles.dialog}>
						<View style={{backgroundColor:'#D0D0D0',margin:10}}>
							<Text style={styles.header}>Thay đổi vi phạm</Text>
						</View>
						<View style={styles.inputarea}>
							<View style={styles.inputBox}>
								<Text style={styles.qsTxt}>Tên vi phạm mới</Text>
								<TextInput  
									style={styles.numarea}
									value={nvp}
									onChangeText={value => setNvp(value)}
								/>
							</View>
																
							<View style={styles.inputBox}>
								<Text style={[styles.qsTxt,{marginBottom:10}]}>Điểm cộng/ trừ khi vi phạm</Text>
								<NumericInput  
									value={nscore}
									onChange={value => setNscore(value)} 
									rounded
									iconSize={30}
								/>
								<Text style={{marginTop:10}}>VD: Hãy nhập 5 nếu là điểm cộng hoặc nhập -5 nếu là điểm trừ</Text>
							</View>	
						</View>
					</ScrollView>
					<View style={styles.CorD}>
						<Button
							onPress={()=>{
								setModal2(false);setNscore(0);
								setNvp('');setIdChange('')
							}}
							title='Hủy bỏ'
							color='red'
						/>
						<View style={{width:10}}/>
						<Button
							onPress={HandleChange}
							title='Hoàn thành'
							color='green'
						/>
					</View>
				</View>
			</Modal>	

			<View style={{position:'absolute',bottom:5,left:0,flexDirection:'row',borderRadius:10}}>
				<View style={{flexDirection:'row'}}>
					<TouchableOpacity onPress={() => {setModal(true);setView('none');setRight(0)}}>
						<MaterialCommunityIcons name='plus-circle' size={50} color='blue' />	
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {
							setView(view == 'flex' ? 'none' : 'flex')
							setRight(right == 30 ? 0 : 30)
						}}> 
						<MaterialCommunityIcons name='delete-circle' size={50} color='blue' />
					</TouchableOpacity>
				</View>
			</View>

			<Modal
				animationType='slide'
				transparent={true}
				visible={modal}
			>
				<View style={styles.entireView}>
					<ScrollView style={styles.dialog}>
						<View style={{backgroundColor:'#D0D0D0',margin:10}}>
							<Text style={styles.header}>Thêm vi phạm mới</Text>
						</View>
						<View style={styles.inputarea}>
							<View style={styles.inputBox}>
								<Text style={styles.qsTxt}>Tên vi phạm mới</Text>
								<TextInput  
									style={styles.numarea}
									value={nvp}
									onChangeText={value => setNvp(value)}
								/>
							</View>
																
							<View style={styles.inputBox}>
								<Text style={[styles.qsTxt,{marginBottom:10}]}>Điểm cộng/ trừ khi vi phạm</Text>
								<NumericInput  
									value={nscore}
									onChange={value => setNscore(value)} 
									rounded
									iconSize={30}
								/>
								<Text style={{marginTop:10}}>VD: Hãy nhập 5 nếu là điểm cộng hoặc nhập -5 nếu là điểm trừ</Text>
							</View>

							
						</View>
					</ScrollView>
					<View style={styles.CorD}>
						<Button
							onPress={()=>{
								setModal(false);setNscore(0);setNvp('')
							}}
							title='Hủy bỏ'
							color='red'
						/>
						<View style={{width:10}}/>
						<Button
							onPress={HandleAdd}
							title='Hoàn thành'
							color='green'
						/>
					</View>
				</View>
			</Modal>	
		</View>
	)
}

export default Gutd