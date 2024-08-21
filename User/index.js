import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Image, SafeAreaView, ScrollView, View, Text, Modal, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionGrid, SimpleGrid } from 'react-native-super-grid';
import NumericInput from 'react-native-numeric-input';
import { Button, Surface, DataTable, List, useTheme, Avatar, Card, SegmentedButtons, RadioButton, Divider, Menu, PaperProvider } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { ruleTypes } from 'gifted-charts-core';
import { Dropdown } from 'react-native-element-dropdown';

import { ConvertTime } from '../toolkit.js';
import styles from './styles';
import DATA_URL from '../url.js';

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
	const [selectedWeek, setSelectedWeek] = useState(null)
	const [classPassive, setClassPassive] = useState(null)
	const [signal, setSignal] = useState(false)
	const [staticWidth, setStaticWidth] = useState(0)

	const fetchClassList = async () => {
		try {
			const response = await fetch(DATA_URL+'class');
			const jsonData = await response.json();
			setClassList(jsonData);
		} catch (error) {
			
		}
	};

	const fetchWeek = async () => {
		const date = ConvertTime(new Date())
		try {
			const response = await fetch(DATA_URL+'week');
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
				const response = await fetch(DATA_URL+'lichtruc/'+week);
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
	
// 	const ModelXepHang = () => {
// 		const [week, setWeek] = useState(1)
// 		const [choice, setChoice] = useState('w')
// 		let monthRank = []

// 		if (weekList) {
// 			weekList.map((item, idx)=>{
// 				if ((idx+1)%4 == 0) {
// 					monthRank.push({
// 						monthId:'Tháng ' + ((idx+1) / 4),
// 						monthStart:weekList[idx-3].week_name,
// 						monthEnd:weekList[idx].week_name
// 					})
// 				}
// 			})
// 		}

// 		return (
		 
// 			<Modal
// 				animationType='fade'
// 				transparent={true}
// 				visible={modalXh}
// 			>
// 			<PaperProvider> 
// 				<View style={styles.entireView2}>
// 					<View style={styles.dialog2}>
// 						<TouchableOpacity 
// 							onPress={()=>setModalXh(false)} 
// 							style={{alignSelf:'flex-end',margin:0}}
// 						>
// 							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
// 						</TouchableOpacity>
// 						<View>
// 							<Text style={styles.header}>Bạn muốn xem bảng xếp hạng theo:</Text>
// 						</View>

// {/*						<SegmentedButtons
// 							value={choice}
// 							onValueChange={setChoice}
// 							density='small'
// 							buttons={[
// 								{
// 									value: 'w',
// 									label: 'Tuần',
// 									showSelectedCheck:true,
// 									checkedColor:'blue',
// 									style:{backgroundColor:'white'},									
// 								},
// 								{
// 									value: 'm',
// 									label: 'Tháng',
// 									showSelectedCheck:true,
// 									checkedColor:'blue',
// 									style:{backgroundColor:'white'},	
// 									disabled:true								
// 								},
// 								{ value: 'hk', 
// 									label: 'Học kì', 
// 									showSelectedCheck:true,
// 									checkedColor:'blue',
// 									style:{backgroundColor:'white'},
// 									disabled:true
// 								},
// 							]}
// 						/>*/}
					
// 						<ScrollView 
// 							showsVerticalScrollIndicator={false}
// 							contentContainerStyle={{marginTop:5,alignItems:'center',display:(choice == 'm' ? 'flex' : 'none')}}>
// 								{monthRank.length != 0
// 								&&  (
// 											// <SimpleGrid
// 											//   data={monthRank}
// 											//   itemDimension={}
// 											//   spacing={10}
// 											//   renderItem={({item, index}) => 
// 											//   	<Button color='blue' title={`${item.monthId}: từ ${item.monthStart} đến ${item.monthEnd}`} onPress={()=>{
// 											// 				setMwk(false);
// 											// 				navigation.navigate('Model',{login:login,type:typefnc,week:item.week_id,weekin4:item})
// 											// 			}}
// 											// 		/>
// 											// 	}
// 											// />

// 											// <FlatList
// 											//   data={monthRank}
// 											//   renderItem={({item}) => (
// 											//   	<Button color='blue' title={`${item.monthId}: từ ${item.monthStart} đến ${item.monthEnd}`}/>
// 											//   )}
// 											//   keyExtractor={item => item.monthId}
// 											// />

// 											monthRank.map(item => (
// 												<View style={{margin:5}}>
// 													<Button 
// 														color='blue' title={`${item.monthId}: từ ${item.monthStart} đến ${item.monthEnd}`}
// 														onPress={()=>{
// 															setModalXh(false)
// 														}}
// 													/>
// 												</View>					      				
// 											))
// 										)
// 								}
// 						</ScrollView>
// 					</View>
// 				</View>
// 			</PaperProvider>
// 			</Modal>
		
// 		)
// 	}

	const ModelWeek = () => {

		return (
			<Modal
				animationType='fade'
				transparent={true}
				visible={modalWk}
			> 
				<View style={[styles.entireView2,{justifyContent:'center',alignItems:'center'}]}>
					<Card>
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
				        placeholder={weekList[0]?.week_name}
				        value={selectedWeek}
				        onChange={item => setSelectedWeek(item)}
				        itemContainerStyle={{borderWidth:0.5}}
				      />	
						)
						: (<View><Text>Đang chờ...</Text></View>)
						}	
							
						</Card.Content>
						<Card.Actions>
							<Button mode='contained' buttonColor='#0288d1' onPress={() => {
			        	setMwk(false);
								navigation.navigate('Model',{
										login:login,
										loginIn4:loginIn4,
										type:typefnc,
										week:selectedWeek.week_id,
										weekin4:selectedWeek
									})
			        }}>OK</Button>
							<Button mode='outlined' buttonColor='rgb(255, 218, 214)' onPress={()=>setMwk(false)}>Huỷ</Button>
						</Card.Actions>
					</Card>
				</View>

				{/*<View style={styles.entireView2}>
					<View style={styles.dialog2}>
						<TouchableOpacity 
							onPress={()=>setMwk(false)} 
							style={{alignSelf:'flex-end',margin:0}}
						>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<ScrollView showsVerticalScrollIndicator={false}>
							<Text style={styles.header}>Hãy chọn một tuần</Text>
							{weekList
							?	(
									<SimpleGrid
										data={weekList}
										itemDimension={50}
										spacing={10}
										renderItem={({item, index}) => 
											<Button color='blue' title={item.week_name} onPress={()=>{
													setMwk(false);
													navigation.navigate('Model',{login:login,loginIn4:loginIn4,type:typefnc,week:item.week_id,weekin4:item})
												}}
											/>
										}
									/>
								)
							:	(
									<ActivityIndicator size="large" />
								)	
							}
						</ScrollView>             
				 </View>
				</View>*/}
			</Modal>
		)
	}

	const Model = () => {
		const [week, setWeek] = useState(1)
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
							<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',}}>
								<Text style={{fontSize:18,fontWeight:'bold'}}>Tuần:</Text>
								<View style={{width:10}} />
								<NumericInput 
									value={week}
									onChange={value => setWeek(value)} 
									rounded
									minValue={1}
								/>
							</View>
							{lst
							?	(
									<SectionGrid
										itemDimension={100}
										sections={lst}
										keyExtractor={(item, index) => item + index}
										renderItem={({item, index}) => ( 	
											<Button mode='elevated' onPress={()=>{
													setMv(false);
													navigation.navigate('Model',{login:login,type:typefnc,classe:item,week:'wk'+('00'+week).slice(-2)})
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

				<Card>
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

					</Card.Content>
				</Card>

				<View style={{height:15}} />

				<Card>
					<Card.Title 
						title='Số liệu thống kê hiện tại' titleVariant='titleLarge'
						left={(props) => <Avatar.Icon theme={ {colors: {primary: "#fff"}}} {...props} color={'#1FBFF4'} icon='google-analytics' />}
					/>
					<Divider />
					<Card.Content onLayout={(event) => setStaticWidth(event.nativeEvent.layout.width)}>

						<LineChart
							isAnimated
              initialSpacing={0}
              data={lineData}
             	rulesColor="gray"
            	rulesType="solid"             
              textColor1="yellow"
              textShiftY={-8}
              textShiftX={-10}
              textFontSize={13}
              thickness={5}
              noOfSections={5}
              yAxisColor="#0BA5A4"
              spacing={60}
              xAxisColor="#0BA5A4"
              color="#0BA5A4"
	          />
					</Card.Content>
				</Card>

				<Model />
				<ModelWeek />
				{/*<ModelXepHang />*/}
			</ScrollView>

		</SafeAreaView>
	)
}

export default User