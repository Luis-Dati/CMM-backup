import React, {useState, useEffect} from 'react'
import { FlatList, View, Text, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SimpleGrid } from 'react-native-super-grid';
import { useTheme, List, Card, Divider } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

import styles from './styles'
import Form from '../../components/Form/index'
import { DATA_URL, API_KEY } from '../../url.js';
import { CombineConvert } from '../../toolkit.js'

let deviceWidth = Dimensions.get('window').width

const Stvp = ({ classe, login, week }) => {
	const theme = useTheme();
	const [vpmList, setVpmList] = useState(null);
	const [ruleList, setRuleList] = useState(null);
	const [signal, setSignal] = useState(false)
	const [view, setView] = useState('none')
	const [create, setCreate] = useState(false)
	const [SDBList, setSDBList] = useState([])
	const [sotiet, setSotiet] = useState(0)

	const [changeModel, setChangeModel] = useState(false)
	const [changeNum, setChangeNum] = useState(0)
	const [changeType, setChangeType] = useState(null)
	const [changeDay, setChangeDay] = useState(null)
	const [changeLst, setChangeLst] = useState([])
	const [rtData, setRtData] = useState(null)
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
	var data2 = null


  const fetchVpmList = async () => {
    try {
      const response = await fetch(DATA_URL+'vipham/cls'+classe+'/'+week, {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
      const jsonData = await response.json();
      let check = jsonData.find(obj=>obj.bonus=='Điểm sổ đầu bài')
      if (check) {
 				setCreate(true)
 				setSDBList(JSON.parse(check.name_student))
 				setSotiet(check.quantity)
 			} else {
 				setSDBList([
					{day:'2','Tiet1':'0','Tiet2':'0','Tiet3':'0','Tiet4':'0','Tiet5':'0'},
					{day:'3','Tiet1':'0','Tiet2':'0','Tiet3':'0','Tiet4':'0','Tiet5':'0'},
					{day:'4','Tiet1':'0','Tiet2':'0','Tiet3':'0','Tiet4':'0','Tiet5':'0'},
					{day:'5','Tiet1':'0','Tiet2':'0','Tiet3':'0','Tiet4':'0','Tiet5':'0'},
					{day:'6','Tiet1':'0','Tiet2':'0','Tiet3':'0','Tiet4':'0','Tiet5':'0'},
					{day:'7','Tiet1':'0','Tiet2':'0','Tiet3':'0','Tiet4':'0','Tiet5':'0'}
				])
 			}
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
      jsonData = jsonData.find(item=>item.class_id == 'cls'+classe)
      setNoteList(jsonData);
    } catch (error) {
      
    }
  };

  function changeVpm(vpm, quantity, stumtk, mainData, day) {
  	let lstStu = {}
  	stumtk.split(', ').map((item,index) => lstStu[index]=item)
  	setChangeType(vpm)
  	setChangeLst(lstStu)
  	setChangeNum(quantity)
  	setChangeDay(day)
  	setRtData(mainData)
  	setChangeModel(true)
  }

  async function CreateData () {
  	await fetchVpmList()
  	await fetchRuleList()
  	await fetchNoteList()
  }

  if (ruleList != null && vpmList != null) {
 		let dataTemp = JSON.parse(JSON.stringify(vpmList));

 		dataTemp.map((item)=>{
 			if (item.bonus == null) {
 				let vpmRule = ruleList.find((item2)=>item2.name_vp_id == item.name_vp_id)
 				item.name_vp_id = vpmRule	
 			}
 		})

 		data2 = dataTemp
 	}

  useEffect(() => {
  	CreateData()
  }, [signal])

 	const optChange = (item, opt) => {
		return {
			method:"PUT",
			headers: {
				'Accept': 'application/json',
				"Content-Type":"application/json",
				'api-key': API_KEY,
			},
			body: JSON.stringify({...item, change: opt})
		}
	}

	const handleAdd = async (item) => {
		let option={
			method:"POST",
			headers: {
				'Accept': 'application/json',
				"Content-Type":"application/json",
				'api-key': API_KEY,
			},
			body: JSON.stringify(item)
		};

		const response = await fetch(DATA_URL+'vipham', option);
		const responseInc = await fetch(DATA_URL+'statisticOnDay', optChange(item, 'inc'));
		
		if (response.status === 200 && responseInc.status === 200) {
	    Alert.alert('Thông báo', 'Thêm thành công',[
    		{text:'Ok',onPress:() => setSignal(item)}
    	])
	  } else {
	    Alert.alert('Thêm thất bại');
	  }	
	}

	const handleChange = async (item) => {
		let option={
			method:"PUT",
			headers: {
				'Accept': 'application/json',
				"Content-Type":"application/json",
				'api-key': API_KEY,
			},
			body: JSON.stringify(item)
		};
		
		const response = await fetch(DATA_URL+'vipham', option);
		if (response.status === 200) {
	    Alert.alert('Thông báo', 'Chỉnh sửa thành công',[
    		{text:'Ok',onPress:() => setSignal(item)}
    	])
	  } else {
	    Alert.alert('Chỉnh sửa thất bại');
	  }	

	}

	const handleDel = async (item,index) => {
		if (item.create_by == 'admin' && login != 'admin') {
			Alert.alert('Thông báo','Bạn không có quyền xóa vi phạm này')
			return
		}
		let option = {
		  method: 'DELETE',
		  headers: {
		    'api-key': API_KEY,
		  }
		};
		
		const response = await fetch(DATA_URL+'vipham/'+item.vpm_id, option)
		const responseDec = await fetch(DATA_URL+'statisticOnDay', optChange(item, 'dec'));
		
		if (response.status === 200 && responseDec.status === 200) {
	    Alert.alert('Thông báo', 'Xoá thành công',[
    		{text:'Ok',onPress:() => setSignal(item)}
    	])
	  } else {
	    Alert.alert('Xoá thất bại');
	  }

	}
	
	function ConvertItem() {
		if (ruleList) {
			return ruleList.map(item=>({item:item.name_vp,id:item.name_vp_id}))	
		}
		else {
			return []
		}	  
	}

	function ViphamDay() {
		if (selectedDay.id != 0) {
			return data2.filter(item=>item.day == selectedDay.id)
		} else {
			return data2
		}
	}

	return (
		<View style={{flex:1}}>
		<ScrollView stickyHeaderIndices={[2]}>
			<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
				<Card.Title title={`Danh sách vi phạm ${classe}`} titleVariant='headlineMedium'
					subtitle={`Tuần ${week.slice(2)}`} subtitleVariant='titleMedium'
				/>
			</Card>

			<View style={{height:10}}/>

			<View>	
				<View style={[styles.filterBox, {backgroundColor: theme.colors.ownColorContainer}]}>
					<Text style={styles.qsTxt}>Lọc theo: </Text>
	 				<Dropdown
	 					autoScroll={false}
		        style={[styles.dropdown, {width: 100}]}
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
		        style={[styles.dropdown, {width: 120}]}
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
												<View style={{flexDirection:'row'}}>
													<View style={styles.frame}>
														<Text style={{fontSize:16, width:'65%'}}>{item.bonus}</Text>
														<Text style={{fontSize:16}}>{item.quantity} điểm</Text>
													</View>
													<TouchableOpacity onPress={()=>handleDel(item,index)} style={[styles.delBox,{display:view}]}>
														<MaterialCommunityIcons name='close-box' color='black' size={40} />
													</TouchableOpacity>	
												</View>	
												)
											: (
													<TouchableOpacity style={styles.frame}>
														<Text style={{fontSize:16}}>{item.bonus}</Text>
													</TouchableOpacity>	
												)
											}
											<Text>Ngày tạo: {CombineConvert(item.create_at)}, bởi: {item.create_by.includes('sdl') ? 'Sao đỏ '+item.create_by.slice(3) : item.create_by}</Text>												
										</>
									)
								:	(
										<TouchableOpacity  
											onPress={()=>
												{
													if ((item.create_by == 'admin' || item.modified_by == 'admin') && login != 'admin') {
														Alert.alert('Thông báo','Bạn không có quyền chỉnh sửa vi phạm này')
													} else {
														changeVpm(
															{
																id: item.name_vp_id?.name_vp_id, 
																item: item.name_vp_id?.name_vp
															}, 
															item.quantity, 
															item.name_student, 
															{
																vpm_id: item.vpm_id,
																week_id: item.week_id,
																class_id: item.class_id,
																modified_by: login
															},
															{
																id: item.day,
																item: 'Thứ '+(item.day+1)	
															}
														)
													}
												}
											}
										>
											<View style={{flexDirection:'row'}}>
												<View style={styles.frame}>
													<Text style={{fontSize:16,width:'65%'}}>{item.name_vp_id?.name_vp}</Text>
													<Text style={{fontSize:16}}>{item.quantity} học sinh</Text>
												</View>
												<TouchableOpacity onPress={()=>handleDel(item,index)} style={[styles.delBox, {display:view}]}>
													<MaterialCommunityIcons name='close-box' color='black' size={40} />
												</TouchableOpacity>	
											</View>
											<View>
												<Text>Ngày tạo: {CombineConvert(item?.create_at)}, bởi: {item.create_by.includes('sdl') ? 'Sao đỏ '+item.create_by.slice(3) : item.create_by}</Text>
												{item.modified_by
												&& (<Text>Chỉnh sửa bởi: {item.modified_by.includes('sdl') ? 'Sao đỏ '+item.modified_by.slice(3) : item.modified_by}</Text>)
												}
												{item.name_student
												&& (<Text>Danh sách hs vi phạm: {item.name_student}</Text>)
												}									
											</View>
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
     		  
		  <Form 
		  	items={ConvertItem()} 
		  	SDBList={SDBList}
		  	setSDBList={setSDBList}
		  	sotiet={sotiet}
		  	setSotiet={setSotiet}
		  	ruleList={ruleList} 
		  	role={login} view={view} 
		  	setFnc={setView} 
		  	addItem={handleAdd}
		  	addItemSDB={create ? handleChange : handleAdd}
		  	changeItem={handleChange} 
		  	week={week} classe={classe} 
		  	changeModel={changeModel} setChangeModel={setChangeModel}
		  	changeNum={changeNum} setChangeNum={setChangeNum}
		  	changeLst={changeLst} setChangeLst={setChangeLst}
		  	changeType={changeType} setChangeType={setChangeType}
		  	changeDay={changeDay} setChangeDay={setChangeDay}
		  	rtData={rtData}
		  />
		  
		</View>
	)
}

export { Stvp }