import React, { useState, useEffect } from 'react'
import { FlatList, View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import 'intl';
import 'intl/locale-data/jsonp/vi'
import { Dropdown } from 'react-native-element-dropdown';

import styles from './styles'
import DATA_URL from '../url.js'

const Main = ({route, navigation}) => {
	const { classId, weekSpec } = route.params;
	const [vpmList, setVpmList] = useState(null);
	const [ruleList, setRuleList] = useState(null);
	const [signal, setSignal] = useState(false)
	const [week, setWeek] = useState(null)
	const [modalSDB, setModalSDB] = useState(false)
	var data2 = null
	const [selectedDay, setSelectedDay] = useState({id:0,item:'Tất cả'},)
	const days = [
		{id:0,item:'Tất cả'},
		{id:1,item:'Thứ 2'},
		{id:2,item:'Thứ 3'},
		{id:3,item:'Thứ 4'},
		{id:4,item:'Thứ 5'},
		{id:5,item:'Thứ 6'},
		{id:6,item:'Thứ 7'},
	]

	const fetchWeek = async () => {
		const date = ConvertTime(new Date())
		try {
			const response = await fetch(DATA_URL+'week');
			const jsonData = await response.json();
			const temp = jsonData.find(obj => new Date(obj.start_date) <= date && date <= new Date(obj.end_date)) 
			setWeek(temp.week_id)
		} catch (error) {
			
		}
	};

  const fetchVpmList = async () => {
    try {
      const response = await fetch(DATA_URL+'vipham/'+classId+'/'+week);
      const jsonData = await response.json();
      setVpmList(jsonData);
    } catch (error) {
      
    }
  };

  const fetchRuleList = async () => {
    try {
      const response = await fetch(DATA_URL+'rules');
      const jsonData = await response.json();
      setRuleList(jsonData);
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

  function ConvertTime(item){
		const currentTime = new Date(item);
		const localOffset = currentTime.getTimezoneOffset();
		const offsetGMT7 = 7 * 60;
		const timestampGMT7 = currentTime.getTime() + localOffset * 60 * 1000 + offsetGMT7 * 60 * 1000;
		const date = new Date(timestampGMT7);
		return date
	}

	function FormatTime(item){
		const formatter = new Intl.DateTimeFormat('vi-VN', {
		  weekday: 'long',     // Ngày trong tuần, ví dụ: Thứ Hai
		  year: 'numeric',     // Năm, ví dụ: 2023
		  month: 'long',       // Tháng, ví dụ: Tháng Tám
		  day: 'numeric',      // Ngày trong tháng, ví dụ: 2
		  hour: 'numeric',     // Giờ, ví dụ: 14
		  minute: 'numeric',   // Phút, ví dụ: 30
		  second: 'numeric',   // Giây, ví dụ: 45'
		});
		const date = ConvertTime(item)
		return formatter.format(date);
	}
	
	const ModelSDB = ({ SDBList, soTiet }) => {
		
		return (
			<Modal
				animationType='fade'
				transparent={true}
				visible={modalSDB}
			>
				<View style={[styles.entireView,{justifyContent:'center',alignItems:'center'}]}>
					<View style={[{backgroundColor:'#FFF',width:'90%',height:400,paddingHorizontal:10,borderTopLeftRadius:20,borderTopRightRadius:20}]}>
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
									<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Thứ</Text>
									<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 1</Text>
									<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 2</Text>
									<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 3</Text>
									<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 4</Text>
									<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Tiết 5</Text>        
								</View>
								
								{SDBList.map((item,index)=>(
									<View style={{flexDirection:'row'}}>
										<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>{item.day}</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.Tiet1}</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.Tiet2}</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.Tiet3}</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.Tiet4}</Text>
										<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.Tiet5}</Text>
									</View> 
								))}

								<View style={{margin:5}}>
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
		<View style={styles.container}>
		  <Text style={styles.header}>Danh sách vi phạm</Text>
{/*		  <ScrollView showsVerticalScrollIndicator={false}>
				{data2 != null && data2.length != 0 
				? (
   		    data2.map((item, index)=>{
						return (
							<View style={{margin:5}}>
								<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
									{item.name_vp_id == null
									?	(
											<View style={{flex:1}}>
												{item.bonus != 'Điểm sổ đầu bài'
												? (												
														<View style={styles.frame}>
															<Text style={{fontSize:16}}>{item.bonus}</Text>
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
												<Text>Ngày tạo: {FormatTime(item?.create_at)}, bởi: {item.create_by}</Text>												
											</View>
										)
									:	(
											<View style={{flex:1}}>
												<View style={styles.frame}>
													<Text style={{fontSize:16}}>{item.name_vp_id?.name_vp}</Text>
													<Text style={{fontSize:16}}>{item.quantity} học sinh</Text>
												</View>
												<Text>Ngày tạo: {FormatTime(item?.create_at)}, bởi: {item.create_by == 'admin' ? 'admin' : 'Sao đỏ '+item.create_by.slice(3)}</Text>
												<Text>Danh sách hs vi phạm: {item.name_student}</Text>	
											</View>				
										)
									}
								</View>						
								
							</View>
						)
					})	
					) 
				: (
						<View style={styles.itemBox}>
							<Text>Chưa có vi phạm</Text>
							<ActivityIndicator size="large" />
						</View>
					)
				}           
		  </ScrollView>*/}

		  <View style={styles.filterBox}>
 				<Text style={styles.qsTxt}>Lọc theo: </Text>
 				<Dropdown
 					autoScroll={false}
	        style={[styles.dropdown]}
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
 			</View>

		  <FlatList
				style={{
					borderWidth:0.5,  	
					shadowColor: '#000',
			    shadowOffset: {
			      width: 0,
			      height: 1,
			    },
			    shadowOpacity: 0.2,
			    shadowRadius: 1.41,
			    elevation: 2,
			  }}
        data={ViphamDay()}
        renderItem={({item, index}) => (	
					<View style={{margin:5,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
						{item.name_vp_id == null 
						? (
								<View style={{flex:1}}>
									{item.bonus != 'Điểm sổ đầu bài'
									? (												
											<View style={styles.frame}>
												<Text style={{fontSize:16}}>{item.bonus}</Text>
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
									<Text>Ngày tạo: {FormatTime(item?.create_at)}, bởi: {item.create_by.includes('sdl') ? 'Sao đỏ '+item.create_by.slice(3) : item.create_by}</Text>												
								</View>
							)
						:	(
								<TouchableOpacity style={{flex:1}} >
									<View style={styles.frame}>
										<Text style={{fontSize:16,width:'65%'}}>{item.name_vp_id?.name_vp}</Text>
										<Text style={{fontSize:16}}>{item.quantity} học sinh</Text>
									</View>
									<Text>Ngày tạo: {FormatTime(item?.create_at)}, bởi: {item.create_by == 'admin' ? 'admin' : 'Sao đỏ ' +item.create_by.slice(3)}</Text>
									{item.modified_by
									&& (<Text>Được chỉnh sửa bởi: {item.modified_by}</Text>)
									}
									<Text>Danh sách hs vi phạm: {item.name_student}</Text>	
								</TouchableOpacity>
							)
						}
					</View>								
        )

      	}
        keyExtractor={(item, idx) => item.vpm_id}
        ListFooterComponent={
      		<View style={{height:60}} />  	
        }
        ListEmptyComponent={
        	<View style={styles.itemBox}>
						<Text>Chưa có vi phạm</Text>
						<ActivityIndicator size="large" />
					</View>	
        }
      />
		</View>
	)
}

export default Main