import React, {useState, useEffect} from 'react'
import { FlatList, View, Text, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SimpleGrid } from 'react-native-super-grid';
import 'intl';
import 'intl/locale-data/jsonp/vi';
import { Dropdown } from 'react-native-element-dropdown';

import styles from './styles'
import Form from '../../components/Form/index'
import DATA_URL from '../../url.js'

let deviceWidth = Dimensions.get('window').width

const Stvp = ({ classe, login, week }) => {

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
	var data2 = null


  const fetchVpmList = async () => {
    try {
      const response = await fetch(DATA_URL+'vipham/cls'+classe+'/'+week);
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
      const response = await fetch(DATA_URL+'rules');
      const jsonData = await response.json();
      setRuleList(jsonData);
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

	const handleAdd = async (item) => {

		let option={
			method:"POST",
			headers: {
				'Accept': 'application/json',
				"Content-Type":"application/json",
			},
			body: JSON.stringify(item)
		};
		await fetch(DATA_URL+'vipham',option)
			.then((res)=>{
				if (res.ok) {
					Alert.alert('Thông báo','Thêm thành công',[
						{text:'Ok',onPress:() => setSignal(item)}
					])
				}
			})
			.catch((res)=>Alert.alert('Thêm thất bại'))
	}

	const handleChange = async (item) => {

		let option={
			method:"PUT",
			headers: {
				'Accept': 'application/json',
				"Content-Type":"application/json",
			},
			body: JSON.stringify(item)
		};

		await fetch(DATA_URL+'vipham',option)
			.then((res)=>{
				if (res.ok) {
					Alert.alert('Thông báo','Chỉnh sửa thành công',[
						{text:'Ok',onPress:() => setSignal(item)}
					])
				}
			})
			.catch((res)=>Alert.alert('Chỉnh sửa thất bại'))
	}

	const handleDel = async (item,index) => {
		if (item.create_by == 'admin' && login != 'admin') {
			Alert.alert('Thông báo','Bạn không có quyền xóa vi phạm này')
			return
		}
		let option={
			method:"DELETE",
		};
		await fetch(DATA_URL+'vipham/'+item.vpm_id,option)
			.then((res)=>{
				if (res.ok) {
					Alert.alert('Thông báo','Xóa thành công',[
						{text:'Ok',onPress:() => setSignal(item)}
					])
				}
			})
			.catch((res)=>Alert.alert('Xóa thất bại'))
	}

	function ConvertTime(item){
		const currentTime = new Date(item);

		const formatter = new Intl.DateTimeFormat('vi-VN', {
		  weekday: 'long',     // Ngày trong tuần, ví dụ: Thứ Hai
		  year: 'numeric',     // Năm, ví dụ: 2023
		  month: 'long',       // Tháng, ví dụ: Tháng Tám
		  day: 'numeric',      // Ngày trong tháng, ví dụ: 2
		  hour: 'numeric',     // Giờ, ví dụ: 14
		  minute: 'numeric',   // Phút, ví dụ: 30
		  second: 'numeric',   // Giây, ví dụ: 45'
		});

		// Lấy offset (độ lệch) múi giờ của máy tính địa phương so với UTC
		const localOffset = currentTime.getTimezoneOffset();

		// Tính toán offset (độ lệch) múi giờ từ GMT+0 đến GMT+7 (7 * 60 phút)
		const offsetGMT7 = 7 * 60;

		// Tính toán timestamp mới cho thời gian theo múi giờ GMT+7
		const timestampGMT7 = currentTime.getTime() + localOffset * 60 * 1000 + offsetGMT7 * 60 * 1000;

		// Tạo một đối tượng Date mới từ timestamp đã tính toán
		const date = new Date(timestampGMT7);
		return formatter.format(date);
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
		  <Text style={styles.header}>Danh sách vi phạm {classe} (Tuần {week.slice(2)})</Text>  
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
												<Text style={{fontSize:16, width:'65%'}}>{item.bonus}</Text>
												<Text style={{fontSize:16}}>{item.quantity} điểm</Text>
											</View>	
										)
									: (
											<TouchableOpacity style={styles.frame}>
												<Text style={{fontSize:16}}>{item.bonus}</Text>
											</TouchableOpacity>	
										)
									}
									<Text>Ngày tạo: {ConvertTime(item.create_at)}, bởi: {item.create_by.includes('sdl') ? 'Sao đỏ '+item.create_by.slice(3) : item.create_by}</Text>												
								</View>
							)
						:	(
								<TouchableOpacity 
									style={{flex:1}} 
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
									<View style={styles.frame}>
										<Text style={{fontSize:16,width:'65%'}}>{item.name_vp_id?.name_vp}</Text>
										<Text style={{fontSize:16}}>{item.quantity} học sinh</Text>
									</View>
									<Text>Ngày tạo: {ConvertTime(item?.create_at)}, bởi: {item.create_by == 'admin' ? 'admin' : 'Sao đỏ ' +item.create_by.slice(3)}</Text>
									{item.modified_by
									&& (<Text>Được chỉnh sửa bởi: {item.modified_by}</Text>)
									}
									<Text>Danh sách hs vi phạm: {item.name_student}</Text>	
								</TouchableOpacity>
							)
						}

						{item.bonus != 'Điểm sổ đầu bài'
						&& (
								<TouchableOpacity onPress={()=>handleDel(item,index)} style={[styles.delBox,{display:view}]}>
									<MaterialCommunityIcons name='delete-forever' color='black' size={30} />
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