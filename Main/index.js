import React, { useState, useEffect } from 'react'
import { FlatList, View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme, List, Card, Divider } from 'react-native-paper';

import styles from './styles'
import { DATA_URL, API_KEY } from '../url.js';

import { CombineConvert, ConvertTime } from '../toolkit.js';

const Main = ({route, navigation}) => {
	const theme = useTheme()
	const { classId, weekSpec } = route.params;
	const [vpmList, setVpmList] = useState(null);
	const [ruleList, setRuleList] = useState(null);
	const [signal, setSignal] = useState(false)
	const [week, setWeek] = useState(null)
	const [modalSDB, setModalSDB] = useState(false)
	var data2 = null
	const [selectedDay, setSelectedDay] = useState({id:0,item:'Tất cả'})
	const [selectType, setSelectType] = useState({id:'D',item:'Chi tiết'})
	const [noteList, setNoteList] = useState(null)

	const days = [
		{id:0,item:'Tất cả'},
		{id:1,item:'Thứ 2'},
		{id:2,item:'Thứ 3'},
		{id:3,item:'Thứ 4'},
		{id:4,item:'Thứ 5'},
		{id:5,item:'Thứ 6'},
		{id:6,item:'Thứ 7'},
	]
	const type = [
		{id:'D',item:'Chi tiết'},
		{id:'S',item:'Ngắn gọn'}
	]

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
			const temp = jsonData.find(obj => new Date(obj.start_date) <= date && date <= new Date(obj.end_date)) 
			setWeek(temp.week_id)
		} catch (error) {
			
		}
	};

  const fetchVpmList = async () => {
    try {
      const response = await fetch(DATA_URL+'vipham/'+classId+'/'+week, {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
      const jsonData = await response.json();
      setVpmList(jsonData);
    } catch (error) {
      
    }
  };

  const fetchRuleList = async () => {
    try {
      const response = await fetch(DATA_URL+'rules', {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
      const jsonData = await response.json();
      setRuleList(jsonData);
    } catch (error) {
      
    }
  };

   const fetchNoteList = async () => {
    try {
      const response = await fetch(DATA_URL+'score/'+week, {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
      let jsonData = await response.json();
      jsonData = jsonData.find(item=>item.class_id == classId)
      setNoteList(jsonData);
    } catch (error) {
      
    }
  };

  async function CreateData () {
  	if (weekSpec != null) {
  		setWeek(weekSpec)
  	} else {
  		await fetchWeek()	
  	}
  	await fetchRuleList()
  	await fetchVpmList()
  	await fetchNoteList()
  	setSignal('created')
  }

  if (ruleList != null && vpmList != null) {
 		let dataTemp = JSON.parse(JSON.stringify(vpmList));

 		dataTemp.map((item)=>{
 			let vpmRule = ruleList.find((item2)=>item2.name_vp_id == item.name_vp_id)
 			item.name_vp_id = vpmRule
 		})
 		data2 = dataTemp
 	}

  useEffect(() => {
  	CreateData()
  }, [signal])
	
	const ModelSDB = ({ SDBList, soTiet }) => {
		
		return (
			<Modal
				animationType='fade'
				transparent={true}
				visible={modalSDB}
			>
				<View style={[styles.entireView,{justifyContent:'center',alignItems:'center'}]}>
					<View style={[{backgroundColor:'#FFF',width:'90%',paddingHorizontal:10,borderRadius:20}]}>
						<TouchableOpacity 
							onPress={()=>{setModalSDB(false)}}
							style={{alignSelf:'flex-end'}}
						>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<View style={{backgroundColor:'#D0D0D0',marginBottom:10}}>
							<Text style={styles.header}>Bảng điểm sổ đầu bài</Text>
						</View>
						<ScrollView>
							
							<View>
								<View style={{flexDirection:'row'}}>
									<Text style={[styles.gridTxtQs,{fontWeight:'bold'}]}>Thứ</Text>
									<Text style={[styles.gridTxtQs,{fontWeight:'bold'}]}>Tiết 1</Text>
									<Text style={[styles.gridTxtQs,{fontWeight:'bold'}]}>Tiết 2</Text>
									<Text style={[styles.gridTxtQs,{fontWeight:'bold'}]}>Tiết 3</Text>
									<Text style={[styles.gridTxtQs,{fontWeight:'bold'}]}>Tiết 4</Text>
									<Text style={[styles.gridTxtQs,{fontWeight:'bold'}]}>Tiết 5</Text>        
								</View>
								
								{SDBList.map((item,index)=>(
									<View style={{flexDirection:'row'}}>
										<Text style={[styles.gridTxtQs,{fontWeight:'bold'}]}>{item.day}</Text>
										<Text style={styles.gridTxtQs}>{item.Tiet1}</Text>
										<Text style={styles.gridTxtQs}>{item.Tiet2}</Text>
										<Text style={styles.gridTxtQs}>{item.Tiet3}</Text>
										<Text style={styles.gridTxtQs}>{item.Tiet4}</Text>
										<Text style={styles.gridTxtQs}>{item.Tiet5}</Text>
									</View> 
								))}

								<View style={{margin:10}}>
									<Text style={[styles.qsTxt,{marginRight:10}]}>Số tiết: {soTiet}</Text>
								</View>
							</View>

						</ScrollView>
					</View>
					
					
				</View>
			</Modal>
		)
	}

	function ViphamDay() {
		if (selectedDay.id != 0) {
			return data2.filter(item=>item.day == selectedDay.id)
		} else {
			return data2
		}
	}

	return (
		<ScrollView stickyHeaderIndices={[2]} style={styles.container}>
			<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
				<Card.Title title={`Danh sách vi phạm ${classId ? classId.slice(3) : '...'}`} titleVariant='headlineMedium'
					subtitle={`Tuần ${week ? week.slice(2) : '...'}`} subtitleVariant='titleMedium'
				/>
			</Card>

			<View style={{height:10}}/>

			<View>	
				<View style={[styles.filterBox, {backgroundColor: theme.colors.ownColorContainer}]}>
					<Text style={styles.qsTxt}>Lọc theo: </Text>
	 				<Dropdown
	 					autoScroll={false}
		        style={[styles.dropdown,{width:100}]}
		        iconStyle={{height:30,width:30}}
		        iconColor='black'
		        activeColor='lightblue'
		        data={days}
		        maxHeight={250}
		        labelField="item"
		        valueField="id"
		        placeholder={days[0].item}
		        value={selectedDay}
		        onChange={item => setSelectedDay(item)}
		        itemContainerStyle={{borderWidth:0.5}}
		      />	
		      <Dropdown
	 					autoScroll={false}
		        style={[styles.dropdown, {width:120}]}
		        iconStyle={{height:30,width:30}}
		        iconColor='black'
		        activeColor='lightblue'
		        data={type}
		        maxHeight={250}
		        labelField="item"
		        valueField="id"
		        placeholder={type[0].item}
		        value={selectType}
		        onChange={item => setSelectType(item)}
		        itemContainerStyle={{borderWidth:0.5}}
		      />
				</View>
			</View>
 		
	 		<View style={{height:10}}/>

			{selectType.id == 'D'
			? (
				<FlatList
	        data={ViphamDay()}
	        renderItem={({item, index}) => (	
						<Card style={{backgroundColor: theme.colors.inverseOnSurface, margin:5}}>
							<Card.Content>
								{item.name_vp_id == null 
								? (
										<>
											{item.bonus != 'Điểm sổ đầu bài'
											? (												
													<View style={styles.frame}>
														<Text style={{fontSize:16, width:'65%'}}>{item.bonus}</Text>
														<Text style={{fontSize:16}}>{item.quantity} điểm</Text>
													</View>
												)
											: (
													<TouchableOpacity style={styles.frame} onPress={()=>setModalSDB(true)}>
														<Text style={{fontSize:16}}>{item.bonus}</Text>
														<ModelSDB SDBList={JSON.parse(item.name_student)} soTiet={item.quantity} />
													</TouchableOpacity>	
												)
											}
											<Text>Ngày tạo: {CombineConvert(item.create_at)}, bởi: {item.create_by.includes('sdl') ? 'Sao đỏ '+item.create_by.slice(3) : item.create_by}</Text>												
										</>
									)
								:	(
										<TouchableOpacity>
											<View style={styles.frame}>
												<Text style={{fontSize:16,width:'65%'}}>{item.name_vp_id?.name_vp}</Text>
												<Text style={{fontSize:16}}>{item.quantity} học sinh</Text>
											</View>
											<Text>Ngày tạo: {CombineConvert(item?.create_at)}, bởi: {item.create_by.includes('sdl') ? 'Sao đỏ '+item.create_by.slice(3) : item.create_by}</Text>
											{item.modified_by
											&& (<Text>Chỉnh sửa bởi: {item.modified_by.includes('sdl') ? 'Sao đỏ '+item.modified_by.slice(3) : item.modified_by}</Text>)
											}
											{item.name_student
											&& (<Text>Danh sách hs vi phạm: {item.name_student}</Text>)
											}			
										</TouchableOpacity>
									)
								}					
							</Card.Content>
						</Card>			
	        )

	      	}
	        keyExtractor={(item, idx) => item.vpm_id}
	        ListFooterComponent={
	      		<View style={{height:40}} />  	
	        }
	        ListEmptyComponent={
	        	<View style={styles.itemBox}>
							<Text>Chưa có vi phạm</Text>
							<ActivityIndicator size="large" />
						</View>	
	        }
	      />
				)
			: (
					<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
						<Card.Content>
							<Text style={{fontSize:18,fontWeight:'500'}}>{noteList?.note}</Text>						
						</Card.Content>
					</Card>
				)
			}					
		</ScrollView>
	)
}

export default Main