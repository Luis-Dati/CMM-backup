import React, { useState, useEffect } from 'react'
import { FlatList, ScrollView, View, Text, TouchableOpacity, Modal, Alert } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SimpleGrid } from 'react-native-super-grid';
import SwitchSelector from "react-native-switch-selector";
import NumericInput from 'react-native-numeric-input';
import { useTheme, Button, TextInput, FAB, Portal, Avatar, DataTable, Card, RadioButton, Divider, Menu, PaperProvider, Snackbar } from 'react-native-paper';

import styles from './styles';
import DATA_URL from '../../url.js'
import CryptoES from "crypto-es";

function EncryptPass (pass, key) {
	return CryptoES.AES.encrypt(pass, key).toString();	
}

function DecryptPass (code, key) {
	let bytes = CryptoES.AES.decrypt(code, key);
	return bytes.toString(CryptoES.enc.Utf8);
}

const ShowClass = ({ data2, setSignal, right, view}) => {
  async function handleDel(item) {
  	const response4 = await fetch(DATA_URL+'score/'+item.user_class.class_id, {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

		const response3 = await fetch(DATA_URL+'lichtruc/'+item.user_class.class_id, {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

		const response5 = await fetch(DATA_URL+'viphamall/'+item.user_class.class_id, {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

    const response1 = await fetch(DATA_URL+'user/'+item.user_id, {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

	  const response2 = await fetch(DATA_URL+'class/'+item.user_class.class_id, {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

	  if (response1.status === 200 && response2.status === 200) {
	    Alert.alert('Thông báo', 'Xóa thành công',[
    		{text:'OK',onPress:()=>{setSignal(item)}}
    	])
	  } else {
	    Alert.alert('Error fetching data');
	  }	
  }  

	const [grade, setGrade] = useState(10)
	const options = [
	  { label: "Khối 10", value: '10' },
	  { label: "Khối 11", value: '11' },
	  { label: "Khối 12", value: '12' }
	];
	
	const ShowClassMethod = ({ grade }) => {
		const theme = useTheme();
		let lst = null;

		if (data2.length != 0) {
			lst = data2.filter(obj=>obj.user_id.includes(grade))
		} 

		return (
			<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
				<Card.Title title='Danh sách tài khoản' titleVariant='titleLarge' />
				<Divider />
				<Card.Content>
					<DataTable>
			      <DataTable.Header>
			        <DataTable.Title textStyle={{fontSize:16}}>Tên lớp</DataTable.Title>
			        <DataTable.Title textStyle={{fontSize:16}}>Tài khoản</DataTable.Title>
			        <DataTable.Title numeric textStyle={{fontSize:16}}>Mật khẩu</DataTable.Title>
			      </DataTable.Header>

						<FlatList
			        data={lst}
			        renderItem={({item, index}) => (
								<DataTable.Row key={index+1} onPress={()=>Alert.alert('Thông tin tài khoản',`Username: ${item.user_role} \nPassword: ${item.password}`)}>
				          <DataTable.Cell>{item.user_class?.class_name}</DataTable.Cell>
				          <DataTable.Cell>{item.user_role}</DataTable.Cell>
				          <DataTable.Cell numeric>{item.password}</DataTable.Cell>
				          <TouchableOpacity onPress={()=>{
			 		  				Alert.alert('Thông báo','Bạn có chắc muốn xóa không',[
			 		  					{text:'Ok',onPress:()=>handleDel(item,index)},
			 		  					{text:'Hủy bỏ',style:'cancel'}
			 		  				])}} style={[{alignItems:'center',justifyContent:'center'},{display:view}]}>
										<MaterialCommunityIcons name='close' color='black' size={30} />
									</TouchableOpacity>
									<Divider bold={true}/>
				        </DataTable.Row>
			        )}
			        keyExtractor={(item, idx) => item.user_class+idx}
			        ListEmptyComponent={
			        	<Text>Chưa có danh sách lớp học</Text>	
			        }
			      />			
			    </DataTable>
				</Card.Content>
			</Card>
			// <FlatList
			// 	ListHeaderComponent={
			// 		<View style={{flexDirection:'row',marginRight:right}}>
			// 			<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.175}]}>STT</Text>
			// 			<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.4}]}>Tên lớp</Text>
			// 			<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Tài khoản</Text>
						
			// 		</View>
			// 	}
      //   data={lst}
      //   renderItem={({item, index}) => (
      //   	<TouchableOpacity style={{flexDirection:'row'}}>
			// 			<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.175}]}>{index+1}</Text>
			// 			<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.4}]}>{item.user_class?.class_name}</Text>
			// 			<View style={[styles.gridTxt2,{flex:1}]}>
 		  // 				<Text>Tên: {item.user_role}</Text>
 		  // 				<Text>Mật khẩu: {item.password}</Text>
 		  // 			</View>
 		  // 			<TouchableOpacity onPress={()=>{
 		  // 				Alert.alert('Thông báo','Bạn có chắc muốn xóa không',[
 		  // 					{text:'Ok',onPress:()=>handleDel(item,index)},
 		  // 					{text:'Hủy bỏ',style:'cancel'}
 		  // 				])}} style={[{alignItems:'center',justifyContent:'center'},{display:view}]}>
			// 				<MaterialCommunityIcons name='delete-forever' color='black' size={30} />
			// 			</TouchableOpacity>
			// 		</TouchableOpacity>
      //   )}
      //   keyExtractor={(item, idx) => item.user_class+idx}
      //   ListFooterComponent={
      // 		<View style={{height:50}} />  	
      //   }
      //   ListEmptyComponent={
      //   	<Text>Chưa có danh sách lớp học</Text>	
      //   }
      // />					
		)
	}
	return (
		<View style={{flex:1}}>
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
			<View style={{height:10}} />
			<ScrollView>
				<ShowClassMethod grade={grade} />
				<View style={{height:50}} />
			</ScrollView>
			
			
		</View>	
	)
}

const Dslh = ({ level }) => {
	const [modal, setModal] = useState(false)
	const [modal2, setModal2] = useState(false)
	const [tool, setTool] = useState(true)
	const theme = useTheme()

	const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

	const [view, setView] = useState('none')
	const [totalView, setTotalView] = useState('none')
	const [right, setRight] = useState(0)
	const [newOne, setNewOne] = useState('')
	const [numWeek, setNumWeek] = useState(0)

	const [k10, setk10] = useState(0)
	const [k11, setk11] = useState(0)
	const [k12, setk12] = useState(0)
	const [lst12, setLst12] = useState({})
	const [lst10, setLst10] = useState({})
	const [lst11, setLst11] = useState({})
	
	const handleInputChange12 = (key, value) => {
	  setLst12({...lst12, [key]: value})
	};
	const handleInputChange10 = (key, value) => {
	  setLst10({...lst10, [key]: value})
	};
	const handleInputChange11 = (key, value) => {
	  setLst11({...lst11, [key]: value})
	};

	const [userList, setUserList] = useState(null)
	const [classList, setClassList] = useState(null)
	const [signal, setSignal] = useState(false)
	var data2 = [];

	const fetchUserList = async () => {
    try {
      const response = await fetch(DATA_URL+'user');
      const jsonData = await response.json();
      jsonData.map(obj=>obj.password = DecryptPass(obj.password, obj.user_role))
      setUserList(jsonData);
    } catch (error) {
      
    }
  };

  const fetchClassList = async () => {
    try {
      const response = await fetch(DATA_URL+'class');
      const jsonData = await response.json();
      setClassList(jsonData);
    } catch (error) {
      
    }
  };

  const fetchNumWeek = async () => {
    try {
      const response = await fetch(DATA_URL+'week');
      const jsonData = await response.json();
      setNumWeek(jsonData.length);
    } catch (error) {
      
    }
  };

  const CreateData = async () => {
   	await fetchUserList();
   	await fetchClassList();
  }

  if (userList != null && classList != null) {
 		let dataTemp = JSON.parse(JSON.stringify(userList));

 		dataTemp.map((item)=>{
 			let userClass = classList.filter((item2)=>item2.class_id == item.user_class)
 			item.user_class = userClass[0]
 		})
 		data2 = dataTemp
 	}

 	useEffect(() => {
 		fetchNumWeek()
 	}, [])

  useEffect(() => {
  	CreateData()
  }, [signal]);

  function makeUser(para) {
		let lstUser = []

		function generate() {
		  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		  let result = '';

		  for (let i = 0; i < 10; i++) {
		    const randomIndex = Math.floor(Math.random() * characters.length);
		    result += characters.charAt(randomIndex);
		  }

		  return result;
		}

		para.map((value, index) => {
			lstUser.push({
				user_id:'ur'+value,
				user_class:'cls'+value,
				user_role:'sdl'+value,
				password:EncryptPass(generate(),'sdl'+value),
				role:'Sao đỏ'
			})
		})

		return lstUser
	}

	function makeClass(para) {
		let lstClass = []
		para.map((value, index) => {
			lstClass.push({
				class_id:'cls'+value,
				class_name:'Lớp '+value,
				gvcn_id:null
			})
		})

		return lstClass
	}
	
	async function dataConvert() {
		let list10 = Object.values(lst10);
		let list11 = Object.values(lst11);
		let list12 = Object.values(lst12);

		let newList = Array(...list10,...list11,...list12);
		let newListUser = Array(...makeUser(list10),...makeUser(list11),...makeUser(list12));
		let newListClass = Array(...makeClass(list10),...makeClass(list11),...makeClass(list12));

		let lst = Array.from({ length: numWeek }, (_, i) => ("00" +  (i + 1)).slice(-2));
		newList.forEach(async (data, index)=>{
				await SendClass(newListClass[index])
				await SendUser(newListUser[index])

				lst.forEach(async (item, idx)=>{
					await SendWeek({week_id: 'wk'+item, class_active: 'cls'+data, class_passive: null});
					await SendScore({week_id: 'wk'+item, class_id: 'cls'+data, score: 0});
				})

			}
		)

		Alert.alert('Thông báo','Tạo mới thành công',[
			{text:'Ok',onPress:()=>setSignal('sended1'+newList)}
		])

		async function SendClass(param) {
			const response = await fetch(DATA_URL+'class', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(param),
		  });
	
		}

		async function SendUser(param) {
			const response = await fetch(DATA_URL+'user', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(param),
		  });
	
		}

		async function SendWeek(param) {
			const response = await fetch(DATA_URL+'lichtruc', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(param),
		  });
	
		}

		async function SendScore(param) {
			const response = await fetch(DATA_URL+'score', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(param),
		  });
		  
		}
	}

  async function handleCreate(param) {
  	setModal(false);
  	await dataConvert();
  }

  async function handleDelAll() {
  	const response5 = await fetch(DATA_URL+'viphamallclass', {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

    const response1 = await fetch(DATA_URL+'scoreall', {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

	  const response2 = await fetch(DATA_URL+'lichtrucall', {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

	  const response3 = await fetch(DATA_URL+'userall', {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

	  const response4 = await fetch(DATA_URL+'classall', {
	    method: 'DELETE',
	    headers: {
	      'Content-Type': 'application/json',
	    },
	  });

	  if (response1.status === 200 && response2.status === 200 && response3.status === 200 && response4.status === 200) {
	    Alert.alert('Thông báo', 'Xóa tất cả thành công',[
    		{text:'OK',onPress:()=>{setSignal('sended2')}}
    	])
	  } else {
	    Alert.alert('Error fetching data');
	  }	
	  
  }

  async function handleCreateOne() {	
  	let multi = classList.find((obj)=>obj.class_id === 'cls'+ newOne)
  	if (multi) {
  		Alert.alert('Thông báo','Lớp '+newOne+' đã xuất hiện')
  	} else {
  		setModal2(false)
	  	setNewOne('')

			const response1 = await fetch(DATA_URL+'class', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(makeClass(Array(newOne))[0]),
		  });

			const response2 = await fetch(DATA_URL+'user', {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(makeUser(Array(newOne))[0]),
		  });

			const response3 = await createLt()

			async function createLt () {
			  let lst = Array.from({ length: numWeek }, (_, i) => ("00" +  (i + 1)).slice(-2));
			  
			  await lst.forEach(async (item, idx)=>{
			  	const response3 = await fetch(DATA_URL+'lichtruc', {
				    method: 'POST',
				    headers: {
				      'Content-Type': 'application/json',
				    },
				    body: JSON.stringify({week_id:'wk'+item,class_active:'cls'+newOne,class_passive:null}),
				  });

				  const response4 = await fetch(DATA_URL+'score', {
				    method: 'POST',
				    headers: {
				      'Content-Type': 'application/json',
				    },
				    body: JSON.stringify({week_id: 'wk'+item,class_id: 'cls'+newOne,score: 0}),
				  });
			  })

			  return true
			}

		  if (response1.status === 200 && response2.status === 200) {
		    Alert.alert('Thông báo', 'Thêm thành công',[
	    		{text:'OK',onPress:()=>{setSignal(newOne)}}
	    	])
		  } else {
		    Alert.alert('Error fetching data');
		  }	
  	}
  		
  }

	return (		
		<PaperProvider>
			<ShowClass data2={data2} setSignal={setSignal} right={right} view={view}/>
			
			<Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? 'dots-horizontal-circle' : 'dots-horizontal-circle-outline'}
          actions={[
				    {
				      icon: 'plus-circle',
				      label: 'Tạo 1 lớp',
				      onPress : () => {setModal2(true);setView('none');setRight(0)}
				    },
				    { 
				    	icon: 'close-circle', 
				    	label: 'Xoá 1 lớp',
				    	onPress: () => {setView(view == 'flex' ? 'none' : 'flex');setRight(right == 30 ? 0 : 30)},
				    },
				    {
				      icon: 'playlist-plus',
				      label: 'Tạo mới danh sách',
				      onPress: ()=>{
								setModal(true);setTool(true);
								setLst12({});setLst10({});setLst11({})
								setk10(0);setk11(0);setk12(0)
								setView('none');setRight(0)
							}
				    },
				    {
				      icon: 'playlist-remove',
				      label: 'Xoá bỏ danh sách',
				      onPress: () => {
								Alert.alert('Thông báo', 'Bạn có chắc muốn xóa toàn bộ danh sách không. Thao tác này sẽ xoá toàn bộ lịch trực, điểm, tài khoản sao đỏ của tất cả các lớp',[
									{text:'Chắc',onPress: handleDelAll},
									{text:'Hủy bỏ',style:'cancel'}
								])
							},
				    },
				  ]}
          onStateChange={onStateChange}
        />
      </Portal>

			<Modal
				animationType='slide'
				transparent={true}
				visible={modal}
			>
				<View style={styles.entireView}>
					<View style={styles.dialog}>
						<TouchableOpacity 
							onPress={()=>{
								setModal(false);
								setLst10({});setLst11({});setLst12({});
							}} 
							style={{alignSelf:'flex-end'}}
						>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<ScrollView>
								<View>		
									<View style={styles.boxName}>
										<Text style={[styles.qsTxt,{marginRight:10}]}>Khối 10 có</Text>
										<NumericInput 
											type='up-down' 
											value={k10}
											onChange={value => setk10(value)} 
											rounded
											minValue={0}
										/>
										<Text style={[{marginLeft:10},styles.qsTxt]}>lớp</Text>
									</View>	
									<View style={styles.boxName}>
										<Text style={[styles.qsTxt,{marginRight:10}]}>Khối 11 có</Text>
										<NumericInput 
											type='up-down' 
											value={k11}
											onChange={value => setk11(value)} 
											rounded
											minValue={0}
										/>
										<Text style={[{marginLeft:10},styles.qsTxt]}>lớp</Text>
									</View>
									<View style={styles.boxName}>
										<Text style={[styles.qsTxt,{marginRight:10}]}>Khối 12 có</Text>
										<NumericInput 
											type='up-down' 
											value={k12}
											onChange={value => setk12(value)} 
											rounded
											minValue={0}
										/>
										<Text style={[{marginLeft:10},styles.qsTxt]}>lớp</Text>
									</View>
									{/*<View style={styles.boxName}>
										<Text style={styles.qsTxt}>Định dạng tên lớp</Text>
										<TextInput 
											style={{backgroundColor:'#ABA5A5',fontSize:16,flex:1}}
											placeholder='VD:10a* hoặc 10t*'
										/>
									</View>*/}
								</View>

								<View style={{margin:20,justifyContent:'center',alignItems:'center'}}>
									<Text style={styles.qsTxt}>Nhập tên lớp vào các ô trống dưới đây</Text>
								</View>

								<View>
									<Text style={styles.qsTxt} >Các lớp khối 10</Text>
									<View style={{flexDirection:'row'}}>
										
										<SimpleGrid
								      itemDimension={50}
								      data={[...Array(parseInt(k10))]}
								      style={styles.gridView}
								      //fixed
								      spacing={10}
								      renderItem={({ key, index }) => (
								        // <View style={[styles.itemContainer,{borderWidth:1}]}>
								        // 	<TextInput 
								        // 		style={{width:50,fontSize:16,borderBottomWidth:1,paddingHorizontal:5}} 
								        // 		key={index} 
								        // 		value={lst10[parseInt(index)]}
								        // 		onChangeText={value => handleInputChange10(index,value)}
								        // 	/>
								        // 	<Text>{index+1}</Text>
								        // </View>
								        <TextInput 
								        	contentStyle={{paddingHorizontal:5}}
								        	mode='outlined'
								        	value={lst10[parseInt(index)]}
								        	onChangeText={value => handleInputChange10(index,value)}
								        />
								      )}
								    />
									</View>
										
									<Text style={styles.qsTxt}>Các lớp khối 11</Text>
									<View style={{flexDirection:'row'}}>
										
										<SimpleGrid
								      itemDimension={50}
								      data={[...Array(parseInt(k11))]}
								      style={styles.gridView}
								      //fixed
								      spacing={10}
								      renderItem={({ key, index }) => (
								        // <View style={[styles.itemContainer,{borderWidth:1}]}>
								        // 	<TextInput 
								        // 		style={{width:50,fontSize:16,borderBottomWidth:1,paddingHorizontal:5}} 
								        // 		key={index} 
								        // 		value={lst11[index]}
								        // 		onChangeText={value => handleInputChange11(index,value)}
								        // 	/>
								        // 	<Text>{index+1}</Text>
								        // </View>
								        <TextInput 
								        	contentStyle={{paddingHorizontal:5}}
								        	mode='outlined'
								        	value={lst11[parseInt(index)]}
								        	onChangeText={value => handleInputChange11(index,value)}
								        />
								      )}
								    />										
									</View>
									
									<Text style={styles.qsTxt}>Các lớp khối 12</Text>
									<View style={{flexDirection:'row'}}>
										
										<SimpleGrid
								      itemDimension={50}
								      data={[...Array(parseInt(k12))]}
								      style={styles.gridView}
								      //fixed
								      spacing={10}
								      renderItem={( { key, index } ) => (
								        // <View style={[styles.itemContainer,{borderWidth:1}]}>
								        // 	<TextInput 
								        // 		style={{width:50,fontSize:16,borderBottomWidth:1,paddingHorizontal:5}} 
								        // 		value={lst12[index]}
								        // 		key={index} 
								        // 		onChangeText={value => handleInputChange12(index,value)}
								        // 	/>
								        // 	<Text>{index+1}</Text>
								        // </View>
								        <TextInput 
								        	contentStyle={{paddingHorizontal:5}}
								        	mode='outlined'
								        	value={lst12[parseInt(index)]}
								        	onChangeText={value => handleInputChange12(index,value)}
								        />
								      )}
								    />										
									</View>
													
								</View>												
								
						</ScrollView>	
					</View>
					<View style={{marginHorizontal:20,marginBottom:30}}>
							{tool
							?	(<Button mode='contained' buttonColor='green' onPress={handleCreate}>Tạo mới</Button>)
							:	(<Button mode='contained' buttonColor='#0288d1' onPress={()=>{setModal(false)}}>Chỉnh sửa</Button>)
							}			
						</View>	
				</View>
			</Modal>	
			
			<Modal 
				animationType='fade'
				transparent={true}
				visible={modal2}
			>
				<View style={[styles.entireView,{justifyContent:'center',alignItems:'center'}]}>
					<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
						<Card.Content>
						<DataTable>
							<DataTable.Row>
								<DataTable.Cell>Khối</DataTable.Cell>
								<View>
									<NumericInput  
										onChange={value => {}} 
										rounded
									/>
								</View>
							</DataTable.Row>
								<TextInput 
									mode='outlined'
				 					label='Tên lớp mới' 
				 					value={newOne}
				 					onChangeText={value=>setNewOne(value)}
				 				/>
						</DataTable>
						</Card.Content>
						<Card.Actions>
							<Button mode='contained' buttonColor='#0288d1' onPress={handleCreateOne}>Xác nhận</Button>
							<Button mode='outlined' buttonColor='rgb(255, 218, 214)' onPress={()=>setModal2(false)} >Huỷ bỏ</Button>
						</Card.Actions>
					</Card>
				</View>
				
			</Modal>	
			
		</PaperProvider>			
	)
}

export { Dslh }