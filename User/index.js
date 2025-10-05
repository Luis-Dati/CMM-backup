import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Image, SafeAreaView, ScrollView, View, Text, Modal, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionGrid, SimpleGrid } from 'react-native-super-grid';
import NumericInput from 'react-native-numeric-input';
import { Button, Surface, DataTable, List, useTheme, Avatar, Card, SegmentedButtons, RadioButton, Divider, Menu, PaperProvider } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import { ConvertTime } from '../toolkit.js';
import styles from './styles';
import { DATA_URL, API_KEY } from '../url.js';

const User = ({route, navigation}) => {
	const theme = useTheme()
	const { login, loginIn4 } = route.params;

	const [typefnc, setTypefnc] = useState(null);
	const [modal, setMv] = useState(false)
	const [modalWk, setMwk] = useState(false)
	const [modalXh, setModalXh] = useState(false)
	const [classList, setClassList] = useState(null)
	const [week, setWeek] = useState(null)
	const [weekList, setWeekList] = useState(null)
	const [selectedWeek, setSelectedWeek] = useState("...")
	const [classPassive, setClassPassive] = useState(null)
	const [signal, setSignal] = useState(false)
	const [staticWidth, setStaticWidth] = useState(0)

	const fetchClassList = async () => {
		try {
			const response = await fetch(DATA_URL+'class', {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
			const jsonData = await response.json();
			setClassList(jsonData);
		} catch (error) {
			
		}
	};

	const fetchWeek = async () => {
		const date = ConvertTime(new Date())
		try {
			const response = await fetch(DATA_URL+'week', {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
			const jsonData = await response.json();
			setWeekList(jsonData)
			const temp = jsonData.find(obj => new Date(obj.start_date) <= date && date <= new Date(obj.end_date)) 
			setWeek(temp.week_id)
		} catch (error) {
			
		}
	};

	const fetchLtList = async () => {
		if (week) {
			try {
				const response = await fetch(DATA_URL+'lichtruc/'+week, {
				  method: 'GET',
				  headers: {
				    'api-key': API_KEY,
				  }
				});
				const jsonData = await response.json();
				const temp = jsonData.find(obj => obj.class_active == 'cls' + login.slice(3))        
				if (temp) {
					setClassPassive(temp.class_passive.slice(3))	
				}
			} catch (error) {
				
			}  
		}
	};

	async function CreateDate() {
		await fetchWeek()
		if (login != 'admin') {
			await fetchLtList()	
		}
		setSignal('created')
	}

	useEffect(() => {
		fetchClassList()
		CreateDate()
	}, [signal])

	const onPress = (text) => {
		setTypefnc(text);

		if (text=='Sổ tay vi phạm' && !login.includes('sdl')) {
			setMv(true)
			return
		}; 
		if (text=='Sắp xếp lịch trực') {
			setMwk(true)
			return
		};
		if (text=='Xem bảng xếp hạng') {
			setMwk(true)
			return
		}; 
		if ((week && classPassive) || (login == 'admin')) {
			navigation.navigate('Model',{login:login,type:text,week:week,classe:classPassive})	
		}								
	}
	
	const ModelWeek = () => {

		const handleNavigate = () => {
			if(selectedWeek != "..."){
				setMwk(false);
				navigation.navigate('Model',{
					login:login,
					loginIn4:loginIn4,
					type:typefnc,
					week:selectedWeek.week_id,
					weekin4:selectedWeek,
				})
			}
		}

		return (
			<Modal
				animationType='fade'
				transparent={true}
				visible={modalWk}
			> 
				<View style={[styles.entireView2,{justifyContent:'center',alignItems:'center'}]}>
					<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
						<Card.Title title='Hãy chọn 1 tuần' titleVariant='titleLarge'/>
						<Card.Content>
						{weekList 
						? (
							<Dropdown
								autoScroll={false}
								style={[styles.dropdown]}
								iconStyle={{height:30,width:30}}
								iconColor='black'
								activeColor='lightblue'
								data={weekList}
								maxHeight={250}
								labelField="week_name"
								valueField="week_id"
								placeholder={"..."}
								value={selectedWeek}
								onChange={item => setSelectedWeek(item)}
								itemContainerStyle={{borderWidth:0.5}}
							/>	
						)
						: (<View><Text>Đang chờ...</Text></View>)
						}	
							
						</Card.Content>
						<Card.Actions>
							<Button mode='contained' buttonColor='#0288d1' onPress={handleNavigate}>OK</Button>
							<Button mode='outlined' buttonColor='rgb(255, 218, 214)' onPress={()=>setMwk(false)}>Huỷ</Button>
						</Card.Actions>
					</Card>
				</View>

			</Modal>
		)
	}

	const Model = () => {
		const [week, setWeek] = useState(1);
		const [widthGrid, setWidthGrid] = useState(0);
		let lst = null;
		if (classList) {

			lst = classList.reduce((acc, item) => {
				const grade = item.class_id.slice(3, 5);
				const classData = item.class_id.slice(3);

				const existingGradeIndex = acc.findIndex(obj => obj.grade === grade);

				if (existingGradeIndex !== -1) {
					acc[existingGradeIndex].data.push(classData);
				} else {
					acc.push({ grade, data: [classData] });
				}

				return acc;
			}, []);
		}

		return (  
			<Modal
				animationType='fade'
				transparent={true}
				visible={modal}
			> 
				<View style={styles.entireView2}>
					<View style={styles.dialog2}>
						<TouchableOpacity 
							onPress={()=>setMv(false)} 
							style={{alignSelf:'flex-end',margin:0}}
						>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
								<Text style={{fontSize:18,fontWeight:'bold'}}>Chọn tuần:</Text>
								<View style={{width:10}} />
								{weekList 
								? (
									<Dropdown
										autoScroll={false}
										style={[styles.dropdown]}
										iconStyle={{height:30,width:30}}
										iconColor='black'
										activeColor='lightblue'
										data={weekList}
										maxHeight={250}
										labelField="week_name"
										valueField="week_id"
										placeholder={"..."}
										value={selectedWeek}
										onChange={item => setSelectedWeek(item)}
										itemContainerStyle={{borderWidth:0.5}}
									/>	
								)
								: (<View><Text>Đang chờ...</Text></View>)
								}	
							</View>
							{lst
							?	(
									<SectionGrid
										onLayout={(event) => {
										  setWidthGrid(event.nativeEvent.layout.width);
										}}
										itemDimension={widthGrid / 3}
										sections={lst}
										keyExtractor={(item, index) => item + index}
										renderItem={({item, index}) => (
											<Button labelStyle={{fontSize:16}} mode={widthGrid != 0 ? 'elevated' : 'text'} textColor={widthGrid != 0 ? theme.colors.ownColor : '#fff'} buttonColor={widthGrid != 0 ? theme.colors.lighterOwnColorContainer : '#fff'} onPress={()=>{
												if((login == 'admin12' && !item.includes('12')) || (login == 'admin11' && !item.includes('11')) || (login == 'admin10' && !item.includes('10'))){
													Alert.alert('Thông báo', 'Bạn không có quyền truy cập lớp này')
													return
												}
												
												setMv(false);
												navigation.navigate('Model',{login:login,type:typefnc,classe:item,week:selectedWeek.week_id})
											}}
											>Lớp {item}</Button>
										)}
										renderSectionHeader={({section: {grade}}) => (
											<View style={{marginTop:10}}>
												<Text style={styles.sectionHeader}>Khối {grade}</Text>
											</View>
										)}
									/>
								)
							:	(
									<ActivityIndicator size="large" />
								)	
							}
						</ScrollView>                 
				 </View>
				</View>
			</Modal>
		)
	}

	const customLabel = val => {
		return (
				<View style={{width: 100, marginLeft: 30}}>
						<Text style={{color: 'black', fontWeight: 'bold'}}>{val}</Text>
				</View>
		);
	};

	const lineData = [
			{value: 0, dataPointText: '0', labelComponent: () => customLabel('Thứ 2'),},
			{value: 20, dataPointText: '20', labelComponent: () => customLabel('Thứ 3'),},
			{value: 18, dataPointText: '18', labelComponent: () => customLabel('Thứ 4'),},
			{value: 40, dataPointText: '40', labelComponent: () => customLabel('Thứ 5'),},
			{value: 36, dataPointText: '36', labelComponent: () => customLabel('Thứ 6'),},
			{value: 60, dataPointText: '60', labelComponent: () => customLabel('Thứ 7'),},
	];

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<Card style={{backgroundColor:"#1FBFF4"}}>
					<Card.Title 
						title={login.includes('sdl') ? 'Sao đỏ '+login.slice(3) : login} titleVariant='headlineMedium' titleStyle={{color:'#fff',fontWeight:'bold'}}
						left={(props) => <Avatar.Icon theme={ {colors: {primary: theme.colors.lighterOwnColor}}} {...props} color={'#fff'} icon={login.includes('sdl') ? 'account-star' : 'account-cog'} />} 
						subtitle='Chào mừng bạn đã trở lại!' subtitleStyle={{color: '#fff'}} 
					/>
				</Card>

				<View style={{height:15}} />

				<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
					<Card.Title 
						title='Ứng dụng của tôi' titleVariant='titleLarge' 
						left={(props) => <Avatar.Icon theme={ {colors: {primary: "#fff"}}} {...props} color={'#1FBFF4'} icon='view-grid-outline' />}
					/>	
					<Divider bold/>
					<Card.Content>
						<View style={{height:10}} />

						<View style={{flexDirection:'row'}}>
							<TouchableOpacity style={{alignItems:'center',flex:1}}
								onPress={()=>onPress('Sổ tay vi phạm')}
							>
								<Surface style={{borderRadius:25}} elevation={4}>
									<Avatar.Icon theme={ {colors: {primary: theme.colors.lighterOwnColor}}} size={50} icon="notebook-edit-outline" />
								</Surface>
								<Text style={{textAlign:'center',marginTop:3}}>{`Sổ tay\nvi phạm`}</Text>	
							</TouchableOpacity>

							<TouchableOpacity style={{alignItems:'center',flex:1}}
								onPress={()=>onPress('Xem bảng xếp hạng')}
							>
								<Surface style={{borderRadius:25}} elevation={4}>
									<Avatar.Icon theme={ {colors: {primary: "#fff"}}} color={theme.colors.lighterOwnColor} size={50} icon="podium" />
								</Surface>
								<Text style={{textAlign:'center',marginTop:3}}>{`Bảng\nxếp hạng`}</Text>	
							</TouchableOpacity>

							{login == 'admin'
							&& (
								<TouchableOpacity style={{alignItems:'center',flex:1}}
									onPress={()=>onPress('Giao ước thi đua')}
								>
									<Surface style={{borderRadius:25}} elevation={4}>
										<Avatar.Icon theme={ {colors: {primary: theme.colors.lighterOwnColor}}} size={50} icon="text-box-plus-outline" />
									</Surface>
									<Text style={{textAlign:'center',marginTop:3}}>{`Giao ước\nthi đua`}</Text>	
								</TouchableOpacity>
								)
							}
						</View>

						<View style={{height:15}} />

						{login == 'admin'
						&& (
							<View style={{flexDirection:'row'}}>
								<TouchableOpacity style={{alignItems:'center',flex:1}}
									onPress={()=>onPress('Danh sách lớp học')}
								>
									<Surface style={{borderRadius:25}} elevation={4}>
										<Avatar.Icon theme={ {colors: {primary: "#fff"}}} color={theme.colors.lighterOwnColor} size={50} icon="table-account" />
									</Surface>
									<Text style={{textAlign:'center',marginTop:3}}>{`Danh sách\nlớp học`}</Text>	
								</TouchableOpacity>

								<TouchableOpacity style={{alignItems:'center',flex:1}}
									onPress={()=>onPress('Quản lí lịch tuần')}
								>
									<Surface style={{borderRadius:25}} elevation={4}>
										<Avatar.Icon theme={ {colors: {primary: theme.colors.lighterOwnColor}}} size={50} icon="calendar-month-outline" />
									</Surface>
									<Text style={{textAlign:'center',marginTop:3}}>{`Quản lí\nlịch tuần`}</Text>	
								</TouchableOpacity>

								<TouchableOpacity style={{alignItems:'center',flex:1}}
									onPress={()=>onPress('Sắp xếp lịch trực')}
								>
									<Surface style={{borderRadius:25}} elevation={4}>
										<Avatar.Icon theme={ {colors: {primary: "#fff"}}} color={theme.colors.lighterOwnColor} size={50} icon="calendar-star" />
									</Surface>
									<Text style={{textAlign:'center',marginTop:3}}>{`Sắp xếp\nlịch trực`}</Text>	
								</TouchableOpacity>
							</View>
							)
						}

						<View style={{height:15}} />

						{login == 'admin'
						&& (
							<View style={{flexDirection:'row'}}>
								<TouchableOpacity style={{alignItems:'center',flex:1}}
									onPress={()=>onPress('Thống kê dữ liệu')}
								>
									<Surface style={{borderRadius:25}} elevation={4}>
										<Avatar.Icon theme={ {colors: {primary: "#fff"}}} color={theme.colors.lighterOwnColor} size={50} icon="file-chart" />
									</Surface>
									<Text style={{textAlign:'center',marginTop:3}}>{`Thống kê\ndữ liệu`}</Text>	
								</TouchableOpacity>

							</View>
							)
						}

					</Card.Content>
				</Card>

				<View style={{height:15}} />

				<Model />
				<ModelWeek />
				{/*<ModelXepHang />*/}
			</ScrollView>

		</SafeAreaView>
	)
}

export default User