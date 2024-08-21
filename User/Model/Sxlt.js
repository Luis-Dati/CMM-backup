import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, ScrollView, Button, Modal, TouchableOpacity, Alert } from 'react-native'
import SwitchSelector from "react-native-switch-selector";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDocumentAsync } from 'expo-document-picker';
import XLSX from 'xlsx-js-style';
import { documentDirectory, readDirectoryAsync, readAsStringAsync, writeAsStringAsync, EncodingType } from 'expo-file-system';
import { FAB, Portal, Avatar, DataTable, Card, Divider, PaperProvider } from 'react-native-paper';

import styles from './styles';
import DATA_URL from '../../url.js'

const ShowCalen = ({ grade, data }) => {
	let lst = null;
	if (data) {
		lst = data.filter(item=>item.class_active.includes(grade))  	
	}
	
	return (
		<View>
			{lst != null
			?	(
					<View style={{padding:10}}>
						<View style={{flexDirection:'row'}}>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.4}]}>STT</Text>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Lớp</Text>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Lớp trực</Text>
							
						</View>
						
						{lst.map((item,index)=>(
							<View style={{flexDirection:'row'}}>
								<Text key={index+1} style={[styles.qsTxt,styles.gridTxt2,{flex:0.4}]}>{index+1}</Text>
								<Text key={item.class_active} style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.class_active.slice(3)}</Text>
								<Text key={item.class_passive+'lbt'} style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.class_passive && item.class_passive.slice(3)}</Text>
							</View>	
						))}
							
					</View>
					
				)
			:	(
					<View>
						<Text>Chưa có lịch trực</Text>
					</View>
				)
			}
		</View>
			
	)
}

const ShowCalenHand = ({ grade, data, func, newLt }) => {
	let lst = null;
	if (data) {
		lst = data.filter(item=>item.class_active.includes(grade))  	
	}
	
	return (
		<View>
			{lst != null
			&&	(
					<View style={{padding:10}}>
						<View style={{flexDirection:'row'}}>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.4}]}>STT</Text>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Lớp</Text>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Lớp trực</Text>
							
						</View>
						
						{lst.map((item,index)=>(
							<View style={{flexDirection:'row'}}>
								<Text key={index+1} style={[styles.qsTxt,styles.gridTxt2,{flex:0.4}]}>{index+1}</Text>
								<Text key={item.class_active} style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.class_active.slice(3)}</Text>
								<TextInput 
									placeholder={item.class_passive && item.class_passive.slice(3)}
									placeholderTextColor='gray'
									value={newLt[item.class_active]} 
									onChangeText={value => func(item.class_active, value)} 
									style={[styles.qsTxt,styles.gridTxt2,{backgroundColor:'#D0D0D0',flex:1}]} />
							</View>	
						))}
							
					</View>
					
				)
			}
		</View>
			
	)
}

const Sxlt = ({ root, week }) => {
	const [fileName, setFileName] = useState(null)
	const [fileData, setFileData] = useState(null)
	const [modal, setModal] = useState(false)
	const [modal2, setModal2] = useState(false)
	const [ltList, setLtList] = useState(null)
	const [signal, setSignal] = useState(false)

	const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state

	const [grade, setGrade] = useState(10)
	const [grade2, setGrade2] = useState(10)
	const options = [
		{ label: "Khối 10", value: '10' },
		{ label: "Khối 11", value: '11' },
		{ label: "Khối 12", value: '12' }
	];

	const [newLt, setNewLt] = useState({})
	const handleInputChange = (key, value) => {
	  setNewLt({...newLt, [key]: value})
	};

	async function pickAndParse () {
		try {
			const result = await getDocumentAsync({
				copyToCacheDirectory: true,
				type: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
			});
			
			if (result.type === 'success') {
				setFileName(result.name)
				const path = result.uri;
				const res = await readAsStringAsync(path, { encoding: EncodingType.Base64 });
				const wb = XLSX.read(res, {type: 'base64'});
				const ws = wb.Sheets[wb.SheetNames[0]];
				const jsonData = XLSX.utils.sheet_to_json(ws)
				setFileData(jsonData.map(item=>({
					week_id: week,
					class_active:'cls' + (item['Lớp'].includes('Lớp') ? item['Lớp'].slice(4) : item['Lớp']),
					class_passive:'cls' + (item['Lớp trực'].includes('Lớp') ? item['Lớp trực'].slice(4) : item['Lớp trực'])
				})))
				setModal2(true)
			} else {
				Alert.alert('Thông báo','Chọn file đã bị hủy hoặc thất bại');
			}
		} catch (error) {
			Alert.alert('Thông báo','Không thể chọn file');
			
		}
	};
	
	const fetchLtList = async () => {
		try {
			const response = await fetch(DATA_URL+'lichtruc/'+week);
			const jsonData = await response.json();
			setLtList(jsonData);
			return true
		} catch (error) {
			
		}
	};

	useEffect(() => {
		fetchLtList()
	}, [signal]);

	async function handleComplete (datas) {
		let check = datas.find(item=>item.class_active == item.class_passive)
		let checkPassive = datas.map(item=>item.class_passive)

		const hasDuplicates = (arr) => {
		  const seen = {};
		  for (const item of arr) {
		    if (seen[item]) {
		      return item;
		    }
		    seen[item] = true;
		  }
		  return false;
		};

		const repeats = hasDuplicates(Object.values(checkPassive))
		if (repeats) {
			Alert.alert('Thông báo',`Có nhiều hơn 1 lớp trực lớp ${repeats.includes('cls') ? repeats.slice(3) : repeats}`)
			return
		}

		if (check) {
			Alert.alert('Thông báo','Xuất hiện lớp trực trùng với lớp bị trực ở khối ' + check.class_active.slice(3,5))
		} else {
				
			datas.forEach(async (data, index)=>{
				await SendLt(data)
			})

			Alert.alert('Thông báo','Thay đổi lịch trực thành công',[
				{text:'OK',onPress:()=>{setSignal(datas);setFileData(null);setNewLt({});setModal2(false)}}
			])

		}		

		async function SendLt(item) {
			const response = await fetch(DATA_URL+'lichtruc', {
		    method: 'PUT',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(item),
		  });

		}
			
		setGrade2(10)						
	}

	async function handleCompleteHand () {
				
			const newLtList = Object.entries(newLt).map(([key, value]) => ({
				week_id: week,
			  class_active: key,
			  class_passive: 'cls' + (value.includes('Lớp') ? value.slice(4) : value)
			}));
				
			await handleComplete(newLtList)	
										
	}
	
	return (
		<View>
			<SwitchSelector
				initial={0}
				onPress={value => setGrade(value)}
				textColor='#1FBFF4'
				selectedColor='#fff'
				buttonColor='#1FBFF4'
				borderColor='#1FBFF4'
				hasPadding
				options={options}
				testID="gender-switch-selector"
				accessibilityLabel="gender-switch-selector"
			/>
			<ScrollView>
				<ShowCalen grade={grade} data={ltList}/>
			</ScrollView>	

			<Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? 'dots-horizontal-circle' : 'dots-horizontal-circle-outline'}
          actions={[
				    {
				      icon: 'plus-circle',
				      label: 'Tạo thủ công',
				      onPress : () => setModal2(true)
				    },
				    { 
				    	icon: 'file-excel', 
				    	label: 'Tạo bằng Excel',
				    	onPress: pickAndParse,
				    }
				  ]}
          onStateChange={onStateChange}
        />
      </Portal>
					
			<Modal
				animationType='fade'
				transparent={false}
				visible={modal}
			>
				<View style={{flex:1,padding:10,alignItems:'center'}}>
					<TouchableOpacity style={{alignSelf:'flex-end',marginVertical:5}} onPress={()=>setModal(false)}>
						<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
					</TouchableOpacity>

					<View style={{width:'50%',justifyContent:'space-evenly',height:'50%'}}>					
							
					</View>	
				</View>

			</Modal>

			<Modal
				animationType='fade'
				transparent={true}
				visible={modal2}
			>
				<View style={styles.entireView}>
					<View style={styles.dialog}>
						<TouchableOpacity style={{alignSelf:'flex-end',marginVertical:5}} onPress={()=>{setModal2(false);setFileData(null);setNewLt({})}}>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<View style={{backgroundColor:'#D0D0D0',marginBottom:10}}>
							<Text style={styles.header}>Lịch trực mới</Text>
						</View>
						<SwitchSelector
							initial={0}
							onPress={value => setGrade2(value)}
							textColor='#1FBFF4'
							selectedColor='#fff'
							buttonColor='#1FBFF4'
							borderColor='#1FBFF4'
							hasPadding
							options={options}
							testID="gender-switch-selector"
							accessibilityLabel="gender-switch-selector"
						/>
						<ScrollView>
						  
							{fileData  
							? (
									<View>
										<Text>Bản xem trước của tệp '{fileName}'</Text>
										<ShowCalen grade={grade2} data={fileData}/>
									</View>
								)
							: (
									<ShowCalenHand grade={grade2} data={ltList} func={handleInputChange} newLt={newLt}/>
								)
							}
						</ScrollView>	
					</View>
					<View style={{marginHorizontal:20,marginBottom:30}}>
						<Button title='Hoàn thành' onPress={fileData ? () => handleComplete(fileData) : handleCompleteHand}/>
					</View>
				</View>

			</Modal>
			
		</View>
	)
}

export { Sxlt, ShowCalen }