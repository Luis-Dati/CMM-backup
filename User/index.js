import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, TouchableOpacity, Image, Dimensions, SafeAreaView, ScrollView, View, Text, Modal, Button, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionGrid, SimpleGrid } from 'react-native-super-grid';
import NumericInput from 'react-native-numeric-input';
import { SegmentedButtons, RadioButton, Divider, Menu, PaperProvider } from 'react-native-paper';

import styles from './styles';
import DATA_URL from '../url.js'

const User = ({route, navigation}) => {
	const { login } = route.params;
	const { loginIn4 } = route.params;

	const [typefnc, setTypefnc] = useState(null);
	const [modal, setMv] = useState(false)
	const [modalWk, setMwk] = useState(false)
	const [modalXh, setModalXh] = useState(false)
	const [classList, setClassList] = useState(null)
	const [week, setWeek] = useState(null)
	const [weekList, setWeekList] = useState(null)
	const [classPassive, setClassPassive] = useState(null)
	const [signal, setSignal] = useState(false)

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
	
	function ConvertTime(item){
    const currentTime = new Date(item);

    // Lấy offset (độ lệch) múi giờ của máy tính địa phương so với UTC
    const localOffset = currentTime.getTimezoneOffset();

    // Tính toán offset (độ lệch) múi giờ từ GMT+0 đến GMT+7 (7 * 60 phút)
    const offsetGMT7 = 7 * 60;

    // Tính toán timestamp mới cho thời gian theo múi giờ GMT+7
    const timestampGMT7 = currentTime.getTime() + localOffset * 60 * 1000 + offsetGMT7 * 60 * 1000;

    // Tạo một đối tượng Date mới từ timestamp đã tính toán
    const date = new Date(timestampGMT7);
    return date;
  }

	const Fnction = ({text, iconImg, type, link}) => {
		const onPress = () => {
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
		
		return (
			<TouchableOpacity onPress={onPress} style={[styles.fncBox,styles.boxWithShadow]}>
				<View style={{width:'25%',alignItems:'center'}}>
					<Image 
						source={iconImg}
						style={{height:50,width:50}}/>
				</View>
				<View style={{width:'75%'}}>
					<Text style={styles.fncText}>{text}</Text>
				</View>
					
			</TouchableOpacity>
		)
	}
	
	const ModelXepHang = () => {
		const [week, setWeek] = useState(1)
		const [choice, setChoice] = useState('w')
		let monthRank = []

		if (weekList) {
			weekList.map((item, idx)=>{
				if ((idx+1)%4 == 0) {
					monthRank.push({
						monthId:'Tháng ' + ((idx+1) / 4),
						monthStart:weekList[idx-3].week_name,
						monthEnd:weekList[idx].week_name
					})
				}
			})
		}

		const [visible, setVisible] = useState(false)

		return (
		 
			<Modal
				animationType='fade'
				transparent={true}
				visible={modalXh}
			>
			<PaperProvider> 
				<View style={styles.entireView2}>
					<View style={styles.dialog2}>
						<TouchableOpacity 
							onPress={()=>setModalXh(false)} 
							style={{alignSelf:'flex-end',margin:0}}
						>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<View>
							<Text style={styles.header}>Bạn muốn xem bảng xếp hạng theo:</Text>
						</View>

{/*						<SegmentedButtons
			        value={choice}
			        onValueChange={setChoice}
			        density='small'
			        buttons={[
			          {
			            value: 'w',
			            label: 'Tuần',
			            showSelectedCheck:true,
			          	checkedColor:'blue',
			          	style:{backgroundColor:'white'},									
			          },
			          {
			            value: 'm',
			            label: 'Tháng',
			            showSelectedCheck:true,
			          	checkedColor:'blue',
			          	style:{backgroundColor:'white'},	
			          	disabled:true								
			          },
			          { value: 'hk', 
			          	label: 'Học kì', 
			          	showSelectedCheck:true,
									checkedColor:'blue',
									style:{backgroundColor:'white'},
									disabled:true
			          },
			        ]}
			      />*/}
				  
				    <ScrollView 
				    	showsVerticalScrollIndicator={false}
				    	contentContainerStyle={{marginTop:5,alignItems:'center',display:(choice == 'm' ? 'flex' : 'none')}}>
					      {monthRank.length != 0
					      &&  (
					      			// <SimpleGrid
								      //   data={monthRank}
								      //   itemDimension={}
								      //   spacing={10}
								      //   renderItem={({item, index}) => 
								      //   	<Button color='blue' title={`${item.monthId}: từ ${item.monthStart} đến ${item.monthEnd}`} onPress={()=>{
											// 				setMwk(false);
											// 				navigation.navigate('Model',{login:login,type:typefnc,week:item.week_id,weekin4:item})
											// 			}}
											// 		/>
											// 	}
								      // />

					      			// <FlatList
								      //   data={monthRank}
								      //   renderItem={({item}) => (
								      //   	<Button color='blue' title={`${item.monthId}: từ ${item.monthStart} đến ${item.monthEnd}`}/>
								      //   )}
								      //   keyExtractor={item => item.monthId}
								      // />

					      			monthRank.map(item => (
					      				<View style={{margin:5}}>
					      					<Button 
					      						color='blue' title={`${item.monthId}: từ ${item.monthStart} đến ${item.monthEnd}`}
		      									onPress={()=>{
		      										setModalXh(false)
		      									}}
					      					/>
					      				</View>					      				
					      			))
					      		)
					      }
					  </ScrollView>
				 	</View>
				</View>
			</PaperProvider>
			</Modal>
		
		)
	}

	const ModelWeek = () => {
		return (
			<Modal
				animationType='fade'
				transparent={true}
				visible={modalWk}
			> 
				<View style={styles.entireView2}>
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
				</View>
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
				animationType='slide'
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
										itemDimension={60}
							      sections={lst}
							      keyExtractor={(item, index) => item + index}
							      renderItem={({item, index}) => ( 	
						      		<Button title={'Lớp '+item} onPress={()=>{
													setMv(false);
													navigation.navigate('Model',{login:login,type:typefnc,classe:item,week:'wk'+('00'+week).slice(-2)})
												}}
											/>	
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

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.userbox}>
				<View style={styles.icon}>
				{!login.includes('sdl')
				? (
						<Image 
							source={require('../assets/adminIcon.png')} 
							style={styles.image}
						/>
					)
				: (
						<Image 
							source={require('../assets/noruser.png')} 
							style={styles.image}
						/>
					)
				}
					
				</View>
				<View style={styles.greeting}>
					<Text style={styles.grtText}>Chào mừng bạn đã quay trở lại!</Text>
					<Text style={styles.grtText}>Chức vụ: {login.includes('sdl') ? 'Sao đỏ '+login.slice(3) : login}</Text>
				</View>
			</View>
			<ScrollView 
				style={{flex:1,width:'90%'}}
				showsVerticalScrollIndicator={false}
			>
			<Fnction text='Sổ tay vi phạm' iconImg={require('../assets/notebookedit.png')} />
			{login == 'admin'
			&& (
					<View>
						<Fnction text='Giao ước thi đua' iconImg={require('../assets/new-rule.png')} type='GUTD'/>
						<Fnction text='Danh sách lớp học' iconImg={require('../assets/add-member.png')} type='TTV'/>
						<Fnction text='Sắp xếp lịch trực' iconImg={require('../assets/change.png')} type='SXLT'/>
						<Fnction text='Quản lí lịch tuần' iconImg={require('../assets/calendar.png')} />
					</View>
				)
			}
			<Model />
			<ModelWeek />
			<ModelXepHang />
			<Fnction text='Xem bảng xếp hạng' iconImg={require('../assets/result.png')} type='Xephang'/>
			</ScrollView>
			{/*<View style={{height:70}}></View>*/}
		</SafeAreaView>
	)
}

export default User