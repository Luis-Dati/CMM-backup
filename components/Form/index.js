import React, { useState} from 'react'
import { Dimensions, Image, FlatList, KeyBoard, TextInput, View, Text, Alert, Modal, TouchableOpacity, ScrollView, Button } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NumericInput from 'react-native-numeric-input';
import { SimpleGrid } from 'react-native-super-grid';
import { Dropdown } from 'react-native-element-dropdown';

import styles from './styles'
let deviceWidth = Dimensions.get('window').width;
 
const Form = (props) => {
	const [selectedItem, setSelectedItem] = useState(null);
	const [quantity, setQuantity] = useState(0);

	const [score, setScore] = useState(0)
	const [title, setTitle] = useState()

	const [modal, setMv] = useState(false);
	const [modalBns, setModalBns] = useState(false);
	const [modalSDB, setModalSDB] = useState(false);

	const [stuMstk, setStuMstk] = useState({})
	const [totalView, setTotalView] = useState('none')

	const [selectedDay, setSelectedDay] = useState({id:new Date().getDay(), item:'Thứ '+(new Date().getDay()+1)})
	const days = [
		{id:0,item:'Chủ nhật'},
		{id:1,item:'Thứ 2'},
		{id:2,item:'Thứ 3'},
		{id:3,item:'Thứ 4'},
		{id:4,item:'Thứ 5'},
		{id:5,item:'Thứ 6'},
		{id:6,item:'Thứ 7'},
	]

	function handleInputChange (key, value) {
		setStuMstk({...stuMstk, [key]: value})
	};

	function handleInputChanged (key, value) {
		props.setChangeLst({...props.changeLst, [key]: value})
	};

	function handleInputChangeSDB (key, value, idx) {
		let temp = props.SDBList.splice(idx,1)[0]
		temp[key] = value
		props.setSDBList([...props.SDBList.slice(0,idx), temp, ...props.SDBList.slice(idx,7)])
	};
	
	
	function onChange() {
		KeyBoard.dismiss();
		return (val) => setSelectedItem(val)
	};

	function HandleAdd(frt, sec, thd) {
		if (frt==undefined || sec==0) {
			Alert.alert('Thông báo','Bạn phải nhập đầy đủ dữ liệu');
			
		} else {
			//let vpitem = props.ruleList.find(vpitem=>vpitem.name_vp == selectedItem.item)
			let vpm = {
				name_vp_id: frt.id,
				quantity: sec,
				create_by: props.role,
				week_id: props.week,
				class_id: 'cls' + props.classe,
				name_student: Object.values(thd).join(', '),
				day:selectedDay.id, 
			};

			props.addItem(vpm);
			setMv(false);
			setQuantity(0);
			setSelectedItem(null);
			setStuMstk({})
		}

	};

	function HandleBonus() {
		if (title==undefined) {
			Alert.alert('Thông báo','Bạn phải nhập đầy đủ dữ liệu');
			return
		} else {
			let bonus = {
				bonus: title,
				quantity: score,
				create_by: props.role,
				week_id: props.week,
				class_id: 'cls' + props.classe,
				day: selectedDay.id 
			};

			props.addItem(bonus);
			setModalBns(false);
			setScore(0);
			setTitle()
		}
	}

	function handleSDB(){
		if (props.sotiet == 0) {
			Alert.alert('Thông báo','Bạn chưa nhập số tiết')
			return 
		}

		let sdb = {
			bonus: 'Điểm sổ đầu bài',
			name_student: JSON.stringify(props.SDBList),
			quantity: props.sotiet,
			create_by: props.role,
			week_id: props.week,
			class_id: 'cls' + props.classe 
		};

		props.addItemSDB(sdb);
		setModalSDB(false);
	}

	return (
		<View style={{backgroundColor:'transparent',borderRadius:10}}>
			<View style={{position:'absolute',bottom:5,left:0,flexDirection:'row',alignItems:'center'}}>
				<View style={{flexDirection:'row', alignItems:'center'}}>
					<TouchableOpacity onPress={() => {setMv(true);props.setFnc('none')}}>
						<MaterialCommunityIcons name='plus-circle' size={55} color='blue' />	
					</TouchableOpacity>
					<TouchableOpacity onPress={() => props.setFnc(props.view == 'flex' ? 'none' : 'flex')}> 
						<MaterialCommunityIcons name='delete-circle' size={55} color='blue' />
					</TouchableOpacity>
					<TouchableOpacity style={styles.handMBtn} onPress={()=>{setModalBns(true)}}> 
						<Image source={require('../../assets/DiemB.png')} style={{width:45,height:45}} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.handMBtn} onPress={()=>{setModalSDB(true)}}>
						<Image source={require('../../assets/DiemSDB.png')} style={{width:45,height:45}} />
					</TouchableOpacity> 
					
				</View>
				<Modal
					animationType='fade'
					transparent={true}
					visible={modalBns}
				>
					<View style={[styles.entireView,{justifyContent:'center',alignItems:'center'}]}>
						<View style={{backgroundColor:'#FFF',width:'80%',height:300,padding:10,borderRadius:10}}>
							<TouchableOpacity 
								onPress={()=>{setModalBns(false);setTitle();setScore(0)}}
								style={{alignSelf:'flex-end'}}
							>
								<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
							</TouchableOpacity>

							<View style={[styles.boxName]}>
								<Text style={[styles.qsTxt,{marginRight:10}]}>Chọn ngày vi phạm</Text>
				 				<Dropdown
				 					autoScroll={false}
					        style={[styles.dropdown,{flex:1}]}
					        iconStyle={{height:30,width:30}}
					        activeColor='lightblue'
					        data={days}
					        maxHeight={150}
					        labelField="item"
					        valueField="id"
					        placeholder={days[0].item}
					        value={selectedDay}
					        onChange={item => setSelectedDay(item)}
					        itemContainerStyle={{borderWidth:0.5}}
					      />	
							</View>

							<View style={styles.boxName}>
								<Text style={[styles.qsTxt,{marginRight:10}]}>Lí do</Text>
								<TextInput 
									style={styles.inputBox2} 
									value={title}
									onChangeText={value=>setTitle(value)}
								/>
							</View>
							<View style={styles.boxName}>
								<Text style={[styles.qsTxt,{marginRight:10}]}>Điểm cộng/trừ</Text>
								<NumericInput  
									value={score}
									onChange={value => setScore(value)} 
									rounded
								/>
							</View>
							<Button title='Gửi' onPress={HandleBonus} />
						</View>
					</View>
				</Modal>

				<Modal
					animationType='fade'
					transparent={true}
					visible={modalSDB}
				>
					<View style={[styles.entireView,{justifyContent:'center',alignItems:'center'}]}>
						<View style={[{backgroundColor:'#FFF',width:'90%',height:430,paddingHorizontal:10,borderTopLeftRadius:20,borderTopRightRadius:20}]}>
							<TouchableOpacity 
								onPress={()=>{setModalSDB(false)}}
								style={{alignSelf:'flex-end'}}
							>
								<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
							</TouchableOpacity>
							<View style={{backgroundColor:'#D0D0D0',marginBottom:10}}>
								<Text style={styles.header}>Bảng sổ đầu bài</Text>
							</View>
							<ScrollView>
								
								<ScrollView>
									<View style={{flexDirection:'row'}}>
										<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Thứ</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 1</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 2</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 3</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 4</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 5</Text>        
									</View>
									
									{props.SDBList.map((item,index)=>(
										<View style={{flexDirection:'row'}}>
											<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>{item.day}</Text>
											<TextInput 
												value={item.Tiet1} 
												keyboardType='numeric' 
												style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
												onChangeText={value=>handleInputChangeSDB('Tiet1', value.replace(/\s+|,|-|[.]/g,''), index)} 
											/>
											<TextInput 
												value={item.Tiet2} 
												keyboardType='numeric' 
												style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
												onChangeText={value=>handleInputChangeSDB('Tiet2', value.replace(/\s+|,|-|[.]/g,''), index)} 
											/>
											<TextInput 
												value={item.Tiet3} 
												keyboardType='numeric' 
												style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
												onChangeText={value=>handleInputChangeSDB('Tiet3', value.replace(/\s+|,|-|[.]/g,''), index)} 
											/>
											<TextInput 
												value={item.Tiet4} 
												keyboardType='numeric' 
												style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
												onChangeText={value=>handleInputChangeSDB('Tiet4', value.replace(/\s+|,|-|[.]/g,''), index)} 
											/>
											<TextInput 
												value={item.Tiet5} 
												keyboardType='numeric' 
												style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
												onChangeText={value=>handleInputChangeSDB('Tiet5', value.replace(/\s+|,|-|[.]/g,''), index)} 
											/>
										</View> 
									))}

									<View style={styles.boxName}>
										<Text style={[styles.qsTxt,{marginRight:10}]}>Số tiết</Text>
										<NumericInput  
											value={props.sotiet}
											onChange={props.setSotiet} 
											rounded
											minValue={0}
										/>
									</View>
								</ScrollView>

							
								<View style={{display:'none'}}>
									<Text style={{textAlign:'center',margin:10}}>Hãy chọn 1 tiết trong tuần</Text>
									<View style={{flexDirection:'row'}}>
										<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Thứ</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Tiết</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Điểm</Text>
									</View>
									<View style={{flexDirection:'row'}}>
										<TextInput keyboardType='numeric' style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>0</TextInput>
										<TextInput keyboardType='numeric' style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>0</TextInput>
										<TextInput keyboardType='numeric' style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>0</TextInput>
									</View>
									<Button title='Thêm' onPress={()=>{}} />
								</View>
							</ScrollView>
						</View>
						
						<View style={{width:'90%'}}>
							<Button title='Chỉnh sửa' onPress={handleSDB} />
						</View>
					</View>
				</Modal>	
			</View>	

			<Modal
				animationType='fade'
				transparent={true}
				visible={modal}
			>
				<View style={styles.entireView}>
					<View style={styles.dialog}>
						<TouchableOpacity 
							onPress={()=>{setMv(false);setQuantity(0);setSelectedItem(null)}}
							style={{alignSelf:'flex-end'}}
						>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<ScrollView>
							<View style={{backgroundColor:'#D0D0D0',marginBottom:10}}>
								<Text style={styles.header}>Thêm vi phạm mới</Text>
							</View>
							<View>
								<View style={[styles.inputBox]}>
									<Text style={styles.labelinput}>Chọn ngày vi phạm</Text>
					 				<Dropdown
					 					autoScroll={false}
						        style={[styles.dropdown]}
						        iconStyle={{height:30,width:30}}
						        activeColor='lightblue'
						        data={days}
						        maxHeight={150}
						        labelField="item"
						        valueField="id"
						        placeholder={days[0].item}
						        value={selectedDay}
						        onChange={item => setSelectedDay(item)}
						        itemContainerStyle={{borderWidth:0.5}}
						      />	
								</View>

								<View style={styles.inputBox}>
									<Text style={[styles.labelinput]}>
				            Nhập loại vi phạm
				          </Text>
									<Dropdown
					          style={[styles.dropdown]}
					          iconStyle={{height:30,width:30}}
					          data={props.items ? props.items : []}
					          search
					          activeColor='lightblue'
					          maxHeight={250}
					          labelField="item"
					          valueField="id"
					          placeholder={selectedItem ? selectedItem.item : 'Chọn 1 vi phạm'}
					          searchPlaceholder="Tìm kiếm..."
					          value={selectedItem}
					          onChange={item => setSelectedItem(item)}
					          itemContainerStyle={{borderWidth:0.5}}
					        />
								</View>
																	
								<View style={styles.inputBox}>
									<Text style={styles.labelinput}>Nhập số học sinh vi phạm</Text>
									<NumericInput  
										value={quantity}
										onChange={value => setQuantity(value)} 
										rounded
									/>
								</View>	
									
								<View style={{margin:5,justifyContent:'center',alignItems:'center'}}>
									<Text style={styles.qsTxt}>Nhập tên học sinh vi phạm vào các ô trống dưới đây</Text>
								</View>	
								
								<View style={{flexDirection:'row'}}>
									<SimpleGrid
										itemDimension={140}
										data={[...Array(parseInt(quantity))]}
										style={{flex:1}}
										fixed
										spacing={5}
										renderItem={({ key, index }) => (
											<View style={[styles.itemContainer,{borderWidth:1}]}>
												<TextInput 
													style={{width:140,fontSize:16,borderBottomWidth:1,paddingHorizontal:5}} 
													key={index} 				        		
													value={stuMstk[parseInt(index)]}
													onChangeText={value => handleInputChange(index,value)}
												/>
												<Text>{index+1}</Text>
											</View>
										)}
									/>
								</View>

							</View>
						</ScrollView>
					</View>
					
					<View style={{marginHorizontal:15,marginBottom:30}}>
						<Button title='Hoàn thành' onPress={()=>HandleAdd(selectedItem, quantity, stuMstk)}/>
					</View>
																
				</View>
			</Modal>

			<Modal
				animationType='fade'
				transparent={true}
				visible={props.changeModel}
			>
				<View style={styles.entireView}>
					<View style={styles.dialog}>
						<TouchableOpacity 
							onPress={()=>{props.setChangeModel(false)}}
							style={{alignSelf:'flex-end'}}
						>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<ScrollView>
							<View style={{backgroundColor:'#D0D0D0',marginBottom:10}}>
								<Text style={styles.header}>Chỉnh sửa vi phạm</Text>
							</View>
							<View>
								<View style={[styles.inputBox]}>
									<Text style={styles.labelinput}>Chọn ngày vi phạm</Text>
					 				<Dropdown
					 					autoScroll={false}
						        style={[styles.dropdown]}
						        iconStyle={{height:30,width:30}}
						        activeColor='lightblue'
						        data={days}
						        maxHeight={150}
						        labelField="item"
						        valueField="id"
						        placeholder={props.changeDay ? props.changeDay.item : days[new Date().getDay()].item}
						        value={props.changeDay}
						        onChange={item => props.setChangeDay(item)}
						        itemContainerStyle={{borderWidth:0.5}}
						      />	
								</View>

								<View style={styles.inputBox}>
									<Text style={[styles.labelinput]}>
				            Nhập loại vi phạm
				          </Text>
									<Dropdown
					          style={[styles.dropdown]}
					          iconStyle={{height:30,width:30}}
					          data={props.items ? props.items : []}
					          search
					          maxHeight={250}
					          labelField="item"
					          valueField="id"
					          placeholder={props.changeType ? props.changeType.item : 'Chọn 1 vi phạm'}
					          searchPlaceholder="Tìm kiếm..."
					          value={props.changeType}
					          onChange={item => props.setChangeType(item)}
					          itemContainerStyle={{borderWidth:0.5}}
					        />
								</View>
																	
								<View style={styles.inputBox}>
									<Text style={styles.labelinput}>Nhập số học sinh vi phạm</Text>
									<NumericInput  
										value={props.changeNum}
										onChange={value => {
											if (value < props.changeNum) {
												let clone = JSON.parse(JSON.stringify(props.changeLst));	
												delete clone[String(value)]	
												props.setChangeLst(clone)
												console.log(props.changeLst)
											}
											props.setChangeNum(value)

										}} 
										rounded
									/>
								</View>	
									
								<View style={{margin:5,justifyContent:'center',alignItems:'center'}}>
									<Text style={styles.qsTxt}>Nhập tên học sinh vi phạm vào các ô trống dưới đây</Text>
								</View>	
								
								<View style={{flexDirection:'row'}}>
									<SimpleGrid
										itemDimension={140}
										data={[...Array(parseInt(props.changeNum))]}
										style={{flex:1}}
										fixed
										spacing={5}
										renderItem={({ key, index }) => (
											<View style={[styles.itemContainer,{borderWidth:1}]}>
												<TextInput 
													style={{width:140,fontSize:16,borderBottomWidth:1,paddingHorizontal:5}} 
													key={index} 				        		
													value={props.changeLst[parseInt(index)]}
													onChangeText={value => handleInputChanged(index,value)}
												/>
												<Text>{index+1}</Text>
											</View>
										)}
									/>
								</View>

							</View>
						</ScrollView>
					</View>
					
					<View style={{marginHorizontal:15,marginBottom:30}}>
						<Button title='Hoàn thành' onPress={()=>{
							props.changeItem({
								name_vp_id: props.changeType.id,
								quantity: props.changeNum,
								name_student: Object.values(props.changeLst).join(', '),
								day: props.changeDay.id,
								...props.rtData
							})
							props.setChangeModel(false)
						}}
						/>
					</View>
																
				</View>
			</Modal>

		</View>
	)
}

export default Form