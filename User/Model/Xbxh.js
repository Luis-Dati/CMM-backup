import React, { useState, useEffect } from 'react';
import { TextInput, RefreshControl, FlatList, Alert, Button, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SwitchSelector from "react-native-switch-selector";
import { useNavigation } from '@react-navigation/native';
import NumericInput from 'react-native-numeric-input';
import { useTheme, FAB, Portal, Avatar, DataTable, Card, RadioButton, Divider, Menu, PaperProvider, Snackbar } from 'react-native-paper';
import XLSX from 'xlsx-js-style'
import { documentDirectory, writeAsStringAsync, readAsStringAsync } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import { FormatDate, ConvertTime } from '../../toolkit.js';
import styles from './styles';
import { DATA_URL, API_KEY } from '../../url.js';

const GradeShow = ({ navigation, data2, grade, week, fnc, snackFnc}) => {
	const theme = useTheme();
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);
	const [modal, setModal] = useState(false)
	const [klass, setKlass] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
    	forceUpdate();
      setRefreshing(false);
      snackFnc('Đã làm mới xong')
    }, 2000);
  }, []);

	let lst = null
	
	const bMap = new Map();

	if (data2) {
		lst = data2.filter(obj => obj.class_id.class_id.includes(grade)).sort((a, b)=>(b.score-a.score))	
	}

	const onPress = (classId, className) => {			
		navigation.push("Main",{classId:classId,className:className,weekSpec:week})
	}

	return (
		<>
			<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
				<Card.Title title={`Tuần ${week.slice(2)}`} titleVariant='titleLarge'/>
				<Divider />
				<Card.Content>
					<DataTable>
			      <DataTable.Header>
			        <DataTable.Title textStyle={{fontSize:16}}>Lớp</DataTable.Title>
			        <DataTable.Title textStyle={{fontSize:16}} numeric>Điểm số</DataTable.Title>
			        <DataTable.Title textStyle={{fontSize:16}} numeric>Thứ hạng</DataTable.Title>
			      </DataTable.Header>

						<FlatList
							refreshControl={
				        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				      }
				      data={lst}
				      renderItem={({item, index}) => (
			        	<DataTable.Row 
			        		key={index+1} 
			        		onPress={fnc ? () => onPress(item.class_id?.class_id, item.class_id?.class_name) : () => {setModal(true);setKlass(item.class_id)}}
			        	>
				          <DataTable.Cell>{item.class_id?.class_name}</DataTable.Cell>
				          <DataTable.Cell numeric>{item.score}</DataTable.Cell>
				          <DataTable.Cell numeric>{index+1}</DataTable.Cell>
				        </DataTable.Row>
				      )}
				      keyExtractor={(item, idx) => JSON.stringify(item.class_id)}
				      ListEmptyComponent={
				      	<View style={{marginTop:30,justifyContent:'center',alignItems:'center'}}>
					 				<ActivityIndicator size="large" />
					 			</View>
				      }
				    />
			    </DataTable>
				</Card.Content>
			</Card>

	    <Modal
				animationType='fade'
				transparent={true}
				visible={modal}
			>
				<View style={[styles.entireView,{justifyContent:'center',alignItems:'center'}]}>
					<View style={[{backgroundColor:'#FFF',width:'90%',height:430,paddingHorizontal:10,borderTopLeftRadius:20,borderTopRightRadius:20}]}>	
						<TouchableOpacity 
							onPress={()=>{setModal(false)}}
							style={{alignSelf:'flex-end'}}
						>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<View style={{backgroundColor:'#D0D0D0',marginBottom:10}}>
							<Text style={styles.header}>Vi phạm của {klass?.class_name}</Text>
						</View>
						<ScrollView style={{padding:10}}>
								<Text style={{fontSize:18,fontWeight:'500'}}>
									{data2?.find(item=>item.class_id?.class_id == klass?.class_id)?.note}
								</Text>								
							<View style={{height:50}} />
						</ScrollView>
					</View>
				</View>
			</Modal>	
    </>
	)
}

const Xbxh = ({ week, weekin4, login, loginIn4 }) => {
	const theme = useTheme();
	const navigation = useNavigation();

	const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

	const [choice, setChoice] = useState('all');
	const [scoreList, setScoreList] = useState(null)
	const [classList, setClassList] = useState(null)
	const [vpmList, setVpmList] = useState(null)
	const [ruleList, setRuleList] = useState(null)
	const [signal, setSignal] = useState(false)
	const [modal, setModal] = useState(false)
	const [visible, setVisible] = useState(false)
	const [iniScore, setIniScore] = useState({})	
	const [snackView, setSnackView] = useState(false);
	const [snackMessage, setSnackMessage] = useState('');	
	var data2 = null, data3 = null

	if (snackView) {
		setTimeout(() => setSnackView(false), 5000)
	}

	function SnackPopUp (message) {
		setSnackMessage(message)
		setSnackView(true)
	}

	const handleInputChange = (key, value) => {
	  setIniScore({...iniScore, [key]: value})
	};

	const fetchScoreList = async () => {
    try {
      const response = await fetch(DATA_URL+'score/'+week, {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
      const jsonData = await response.json();
      setScoreList(jsonData);
    } catch (error) {
      
    }
  };

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

  const fetchVpmList = async () => {
    try {
      const response = await fetch(DATA_URL+'vipham/'+week, {
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

  const CreateData = async () => {
   	await fetchScoreList();
   	await fetchClassList();
  }

  const CreateData3 = async () => {
   	await fetchVpmList();
   	await fetchRuleList();
  }

  if (scoreList != null && classList != null) {
 		let dataTemp = JSON.parse(JSON.stringify(scoreList));
 		
 		dataTemp.map((item)=>{
 			let scoreClass = classList.find((item2)=>item2.class_id == item.class_id)
 			item.class_id = scoreClass

 		})
 		data2 = dataTemp
 	}

 	if (ruleList != null && vpmList != null) {
 		let dataTemp3 = JSON.parse(JSON.stringify(vpmList));

 		dataTemp3.map((item)=>{
 			if (item.bonus == null) {
 				let vpmRule = ruleList.find((item2)=>item2.name_vp_id == item.name_vp_id)
 				item.name_vp_id = vpmRule	
 			} else {
 				if (item.bonus == 'Điểm sổ đầu bài') {
 					item.name_student = JSON.parse(item.name_student)
 				}
 			}
 			
 		})
 		data3 = dataTemp3

 	}

 	function minus1days(item) {
		return new Date(new Date(item).getTime() - 24 * 60 * 60 * 1000).toDateString();
	}

	async function TinhDiem2(data) {
		let KList;
		switch (loginIn4.role) {
		case 'admin10':
			KList = scoreList.filter(item=>item.class_id.includes('10'));
			break;
		case 'admin11':
			KList = scoreList.filter(item=>item.class_id.includes('11'))
			break;
		case 'admin12':
			KList = scoreList.filter(item=>item.class_id.includes('12'))
			break;
		default:
			KList = scoreList
		}
		
	  if (KList != null && data != null) {
	    try {
	      for (const objScore of KList) {
	        let iniMinus = 0, cnt = 0, result = 0;

	        for (const obj of data) {
	          if (obj.class_id == objScore.class_id) {
	            if (obj.bonus == null) {
	              iniMinus = iniMinus + obj.name_vp_id.minus_pnt * obj.quantity;
	            } else {
	              if (obj.bonus == 'Điểm sổ đầu bài') {
	              	cnt = obj.quantity
	                result = obj.name_student.reduce((sum, object) => {
	                  return sum + Number(object.Tiet1) + Number(object.Tiet2) + Number(object.Tiet3) + Number(object.Tiet4) + Number(object.Tiet5)
	                }, 0);

	              } else {
	                iniMinus = iniMinus + obj.quantity;
	              }
	            }
	          }
	        }

	        await SendScore({ week_id: objScore.week_id, class_id: objScore.class_id, score: (iniMinus*0.2 + (result/(cnt ? cnt : 0))*10*0.8)});
	      }
	    } catch (error) {
	      
	    }
	  }
	}

	async function SendScore(param) {
	
		const response = await fetch(DATA_URL+'score', {
	    method: 'PUT',
	    headers: {
	      'Content-Type': 'application/json',
	      'api-key': API_KEY,
	    },
	    body: JSON.stringify(param),
	  });
	}

	async function CalculatePoint() {
		await TinhDiem2(data3)
		SnackPopUp('Đã tính điểm xong')
		setSignal('Complete! '+new Date().toString())
		await CalculateData2()

	}

 	// calculate data for xlsx
 	let longestNote = 0;

	const FontStyle = (char) => ({
	  t: 's',
	  v: char,
	  s: {
	    font: { name: "Times New Roman", sz: 13, bold: true, color: { rgb: "000000" } },
	    alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },
	    border: { 
	    	top: { style: 'thin', color: 'black'},
	    	bottom: { style: 'thin', color: 'black'},
	    	left: { style: 'thin', color: 'black'},
	    	right: { style: 'thin', color: 'black'}
	    }
	  }
	})

	const FontStyleNote = (char) => ({
	  t: 's',
	  v: char,
	  s: {
	    font: { name: "Times New Roman", sz: 13, color: { rgb: "000000" } },
	    alignment: { wrapText: true, vertical: 'center' },
	    border: { 
	    	top: { style: 'thin', color: 'black'},
	    	bottom: { style: 'thin', color: 'black'},
	    	left: { style: 'thin', color: 'black'},
	    	right: { style: 'thin', color: 'black'}
	    }
	  }
	})

 	async function CalculateData2() {
 		let temp = [], result = [];

		async function SendNote(param) {
			const response = await fetch(DATA_URL+'scorenote', {
		    method: 'PUT',
		    headers: {
		      'Content-Type': 'application/json',
		      'api-key': API_KEY,
		    },
		    body: JSON.stringify(param),
		  });
		}

 		if (data2 != null && data3 != null) {
 			let GList;
 			switch (loginIn4.role) {
			case 'admin10':
				GList = data2.filter(item=>item.class_id.class_id.includes('10'));
				break;
			case 'admin11':
				GList = data2.filter(item=>item.class_id.class_id.includes('11'))
				break;
			case 'admin12':
				GList = data2.filter(item=>item.class_id.class_id.includes('12'))
				break;
			default:
				GList = data2
			}

	 		const groupedByGrade = GList.reduce((groups, item) => {
			  const { week_id, class_id, ...rest } = item;
			  const grade = class_id.class_id.slice(3, 5);

			  if (!groups[grade]) {
			    groups[grade] = [];
			  }

			  groups[grade].push({ ...rest, class_id: class_id.class_id });
			  return groups;
			}, {});

			for (const gradeTmp in groupedByGrade) {
		    const classes = groupedByGrade[gradeTmp];
		    classes.sort((a, b) => b.score - a.score);

		    let rank = 0;
		    let prevScore = classes[0].score;

		    for (const classObj of classes) {
		      rank++;

		      temp.push({
		        class: classObj.class_id,
		        score: classObj.score,
		        rank: rank
		      });

		      prevScore = classObj.score;
		    }
			  
			}

			let noteList = [];

	 		temp.map(item => { //Lặp qua từng lớp
	 			let tmpVpmRule = data3.filter((item2)=>item2.class_id == item.class) //Lọc ra vi phạm từng lớp và xử lí
	 			item.PlusĐT = 0 
	 			item.MinusĐT = 0 
	 			item.MinusPnt = 0 
	 			item.SoTiet = 0 
	 			item.SĐB = 0
	 			item.supernote = {};
	 			
	 			tmpVpmRule.map(obj => {
	 				if (obj.bonus == null) {
	 					item.MinusPnt = item.MinusPnt + obj.name_vp_id.minus_pnt * obj.quantity
	 					
	 					if (item.supernote[obj.name_vp_id.name_vp]) {
	 						item.supernote[obj.name_vp_id.name_vp].num += obj.quantity
	 						item.supernote[obj.name_vp_id.name_vp].lst += `, ${obj.name_student}` 
	 					} else {
	 						item.supernote[obj.name_vp_id.name_vp] = {}
	 						item.supernote[obj.name_vp_id.name_vp].num = obj.quantity
	 						item.supernote[obj.name_vp_id.name_vp].lst = obj.name_student
	 					}

	 				} else {
	 					// xử lí sđb và bonus
	 					if (obj.bonus != 'Điểm sổ đầu bài') {
	 						item.supernote[obj.bonus]	= 0		
	 						if (obj.quantity < 0 ) {
	 							item.MinusĐT += obj.quantity
	 						} else {
	 							item.PlusĐT += obj.quantity
	 						}
	 					}
	 				}

	 			})

	 			item.note = '';
	 			if (item.supernote) {
		 			let s = Object.entries(item.supernote) 
		 			s.map((itm,idx)=>item.note += `${idx+1}. ${itm[0]}: ${ (itm[1].num ? itm[1].num : '') } ${ (itm[1].lst ? '('+itm[1].lst+')' : '') }\n`) 
		 		}
		 		noteList.push({note:item.note,class_id:item.class,week_id:weekin4.week_id})		
	 		})

	 		noteList.map(async (item) => {
	 			await SendNote(item)
	 		})
	 	}
 	}	

 	async function CalculateSomeData() {
 		SnackPopUp('Hãy chờ một chút trong khi hệ thống chuẩn bị dữ liệu')
 		let specialTemp = [], temp10 = [], temp11 = [], temp12 = [], result = [];

 		if (data2 != null && data3 != null) {
	 		const groupedByGrade = data2.reduce((groups, item) => {
			  const { week_id, class_id, ...rest } = item;
			  const grade = class_id.class_id.slice(3, 5);

			  if (!groups[grade]) {
			    groups[grade] = [];
			  }

			  groups[grade].push({ ...rest, class_id: class_id.class_id });
			  return groups;
			}, {});

			for (const gradeTmp in groupedByGrade) {
		    const classes = groupedByGrade[gradeTmp];
		    classes.sort((a, b) => b.score - a.score);

		    let rank = 0;
		    let prevScore = classes[0].score;

		    for (const classObj of classes) {
		      rank++;

		      if(gradeTmp == "10"){
		 	      temp10.push({
			        class: classObj.class_id,
			        score: classObj.score,
			        rank: rank
			      });
		      } else if (gradeTmp == "11"){
		      	temp11.push({
			        class: classObj.class_id,
			        score: classObj.score,
			        rank: rank
			      });
		      } else {
		      	temp12.push({
			        class: classObj.class_id,
			        score: classObj.score,
			        rank: rank
			      });
		      }

		      prevScore = classObj.score;
		    }
			  
			}

			function findClass(){
				let response = [];
				if (login.includes('sdl')) {
					response = [ temp10.find((item) => login.includes((item.class.slice(3, 7)))) ]
					if(response[0] != undefined){ return response }
						
					response = [ temp11.find((item) => login.includes((item.class.slice(3, 7)))) ]
					if(response[0] != undefined){ return response }
					
					response = [ temp12.find((item) => login.includes((item.class.slice(3, 7)))) ]
					if(response[0] != undefined){ return response }
				}		
				return response		
			}

			function workingWithTemp(temp){
				let s;

		 		result = temp.map(item => { //Lặp qua từng lớp
		 			let tmpVpmRule = data3.filter((item2)=>item2.class_id == item.class) //Lọc ra vi phạm từng lớp và xử lí
		 			item.PlusĐT = 0 
		 			item.MinusĐT = 0 
		 			item.MinusPnt = 0 
		 			item.SoTiet = 0 
		 			item.SĐB = 0
		 			item.supernote = {};
		 			
		 			tmpVpmRule.map(obj => {
		 				if (obj.bonus == null) {
		 					item.MinusPnt = item.MinusPnt + obj.name_vp_id.minus_pnt * obj.quantity
		 					
		 					if (item.supernote[obj.name_vp_id.name_vp]) {
		 						item.supernote[obj.name_vp_id.name_vp].num += obj.quantity
		 						item.supernote[obj.name_vp_id.name_vp].lst += `, ${obj.name_student}` 
		 					} else {
		 						item.supernote[obj.name_vp_id.name_vp] = {}
		 						item.supernote[obj.name_vp_id.name_vp].num = obj.quantity
		 						item.supernote[obj.name_vp_id.name_vp].lst = obj.name_student
		 					}

		 				} else {
		 					// xử lí sđb và bonus
		 					if (obj.bonus == 'Điểm sổ đầu bài') {
		 						item.SoTiet = obj.quantity;
		 						item.SĐB = obj.name_student.reduce((sum, object) => {
		  						return sum + Number(object.Tiet1) + Number(object.Tiet2) + Number(object.Tiet3) + Number(object.Tiet4) + Number(object.Tiet5)
		  					},0);

		 					} else {
		 						item.supernote[obj.bonus]	= 0		
		 						if (obj.quantity < 0 ) {
		 							item.MinusĐT += obj.quantity
		 						} else {
		 							item.PlusĐT += obj.quantity
		 						}
		 					}
		 				}

		 			})

		 			item.note = '';
		 			if (item.supernote) {
			 			s = Object.entries(item.supernote) 
			 			s.map((itm,idx)=>item.note += `${idx+1}. ${itm[0]}: ${ (itm[1].num ? itm[1].num : '') } ${ (itm[1].lst ? '('+itm[1].lst+')' : '') }\n`) 
			 		}
			 		
		 			return ([
		 				FontStyle(item.class.slice(3)),
		 				FontStyle(item.SĐB),
		 				FontStyle(item.SoTiet),
		 				FontStyle(item.MinusPnt + item.MinusĐT),
		 				FontStyle(item.PlusĐT),
		 				FontStyle(item.score),
		 				FontStyle(item.rank),
		 				FontStyleNote(item.note.slice(0, item.note.length-1)), 
		 				(item.supernote ? s.length : 1)
		 			])		
		 		})
		 	
		 		return result	
		 	}

			specialTemp = findClass()
		 	if(specialTemp.length != 0){
		 		return [workingWithTemp(specialTemp)];
		 	} else {
		 		return [workingWithTemp(temp10), workingWithTemp(temp11), workingWithTemp(temp12)];
		 	}
		}
 	}	

  useEffect(() => {
  	CreateData()
  	CreateData3()
  }, [signal]);

	const options = [
	  { label: "Khối 10", value: '10' },
	  { label: "Khối 11", value: '11' },
	  { label: "Khối 12", value: '12' }
	];
	const [grade, setGrade] = useState(10)

	function resetScore(item) {
		if (item.includes('10')) {
			return iniScore.inik10
		}
		if (item.includes('11')) {
			return iniScore.inik11
		}
		if (item.includes('12')) {
			return iniScore.inik12
		} 
	}

	function CheckAgain() {
		if (Object.values(iniScore).length != 3) {
			Alert.alert('Thông báo','Không thể thiết đặt lại vì bạn chưa đặt đủ điểm gốc cho 3 khối')	
		} else {
			Alert.alert('Thông báo','Bạn chắc chắn với sự thiết lập này? Điều này sẽ thay đổi điểm số của tất cả các lớp',[
				{text:'Chắc',onPress:handleChange},
				{text:'Hủy bỏ',style:'cancel'}
			])	
		}		
	}

	async function handleChange() {
		if (choice == 'all') {
			let num = parseInt(week.slice(2));
			let lst = Array.from({ length: 4 - num + 1 }, (_, i) => ("00" +  (i + num)).slice(-2));
			await lst.forEach(async (weekItm)=>{
				await scoreList.forEach(async (item)=>{
					await SendDef({week_id:'wk'+weekItm,class_id:item.class_id,deft:resetScore(item.class_id)})	
				})			
			})

		} else {
			await scoreList.forEach(async (item)=>{
				await SendDef({week_id:item.week_id,class_id:item.class_id,deft:resetScore(item.class_id)})
			})

		}

		Alert.alert('Thông báo','Thiết lập thành công',[
			{text:'OK',onPress:()=>setSignal(iniScore)}
		])

		setIniScore({})
		setModal(false)

		async function SendDef(param) {
			const response = await fetch(DATA_URL+'scoredef', {
		    method: 'PUT',
		    headers: {
		      'Content-Type': 'application/json',
		      'api-key': API_KEY,
		    },
		    body: JSON.stringify(param),
		  });
		}

	}

	// xuất xlsx
	async function writeWorkbookOne(specialClassData) {
	  /* generate worksheet and workbook */
		let MainRow = [
			{ v: 'KẾT QUẢ THI ĐUA TUẦN ' + week.slice(2), t: "s", 
				s: { 

					font: { name: "Times New Roman", sz: 20, bold: true, color: { rgb: "FF0000" } },
					alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} 
				} 
			},
			{ v: 'Tuần: '+week.slice(2)+' (từ '+FormatDate(minus1days(weekin4.start_date))+' đến '+FormatDate(minus1days(weekin4.end_date))+')', t: "s", 
				s: { 
					font: { name: "Times New Roman", sz: 13, bold: true, color: { rgb: "0070c0" } },
					alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} 
				}
			}
		];	

	  const worksheet = XLSX.utils.aoa_to_sheet([[MainRow[0]],[MainRow[1]]])
	  const workbook = XLSX.utils.book_new();

	  const header = ["LỚP", `ĐIỂM\nSĐB`, 'SỐ TIẾT', `ĐIỂM\nTRỪ`, 'ĐIỂM\nCỘNG' ,"TỔNG ĐIỂM", "XẾP HẠNG", "GHI CHÚ"]
		const headerRow1 = header.map(headers => ({
		  t: 's',
		  v: headers,
		  s: {
		    font: { name: "Times New Roman", sz: 13, bold: true, color: { rgb: "FF0000" } },
		    alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },
		    fill: { fgColor: { rgb: "ffff00" } },
		    border: { 
		    	top: { style: 'thin', color: 'black'},
		    	bottom: { style: 'thin', color: 'black'},
		    	left: { style: 'thin', color: 'black'},
		    	right: { style: 'thin', color: 'black'}
		    }
		 	}
		}));

		XLSX.utils.sheet_add_aoa(worksheet, [headerRow1], { origin: "A3" });
	  XLSX.utils.sheet_add_aoa(worksheet, specialClassData, { origin: "A4" });

	  worksheet["!cols"] = []

	  header.forEach((obj, idx)=>{
	  	worksheet["!cols"].push({ wch: header[idx].length*1.8 });
	  })

	  worksheet["!cols"][0].wch = header[0].length*3
		worksheet["!cols"][7].wpx = 750
	  
	  worksheet["!rows"] = [];
	  worksheet["!rows"][0] = {hpx: 30};
		worksheet["!rows"][2] = {hpx: 40};

	  let merge = [
			{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
			{ s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
		];
		
		worksheet["!rows"][3] = {hpx: 20 * specialClassData[0][8]}
		worksheet["!merges"] = merge;

		XLSX.utils.book_append_sheet(workbook, worksheet, weekin4.week_name);
		
		const wbout = XLSX.write(workbook, {type:'base64', bookType:"xlsx"});
	  const file = documentDirectory + "Kết quả thi đua "+weekin4.week_name+" Lớp "+login.slice(3,7)+".xlsx";

	  try {
		  await writeAsStringAsync(file, wbout, {
		    encoding: "base64",
		  });
		  
		  await saveXLSXFile(file);
		} catch (e) {
		  
		}

	  return file;		
	}

	async function writeWorkbook(wb) {
		let data = await CalculateSomeData();
		if(login.includes('sdl')){
			return writeWorkbookOne([...data[0]])
		}

		const data10 = data[0], data11 = data[1], data12 = data[2];
		data = [...data10, ...data11, ...data12];
		
	  /* generate worksheet and workbook */
		let MainRow = [
			{ v: 'KẾT QUẢ THI ĐUA TUẦN ' + week.slice(2), t: "s", 
				s: { 

					font: { name: "Times New Roman", sz: 20, bold: true, color: { rgb: "FF0000" } },
					alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} 
				} 
			},
			{ v: 'Tuần: '+week.slice(2)+' (từ '+FormatDate(minus1days(weekin4.start_date))+' đến '+FormatDate(minus1days(weekin4.end_date))+')', t: "s", 
				s: { 
					font: { name: "Times New Roman", sz: 13, bold: true, color: { rgb: "0070c0" } },
					alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} 
				}
			}
		];	

	  const worksheet = XLSX.utils.aoa_to_sheet([[MainRow[0]],[MainRow[1]]])
	  const workbook = XLSX.utils.book_new();

	  const header = ["LỚP", `ĐIỂM\nSĐB`, 'SỐ TIẾT', `ĐIỂM\nTRỪ`, 'ĐIỂM\nCỘNG' ,"TỔNG ĐIỂM", "XẾP HẠNG", "GHI CHÚ"]
		const headerRow1 = header.map(headers => ({
		  t: 's',
		  v: headers,
		  s: {
		    font: { name: "Times New Roman", sz: 13, bold: true, color: { rgb: "FF0000" } },
		    alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },
		    fill: { fgColor: { rgb: "ffff00" } },
		    border: { 
		    	top: { style: 'thin', color: 'black'},
		    	bottom: { style: 'thin', color: 'black'},
		    	left: { style: 'thin', color: 'black'},
		    	right: { style: 'thin', color: 'black'}
		    }
		 	}
		}));

	  // /* fix headers */
	  let k10 = 0, k11 = 0, k12 = 0;
	  let grade10 = 'Khối 10', grade11 = 'Khối 11', grade12 = 'Khối 12'
	  let gradeLst = []
	  
	  classList.map((obj) => {
	  	if (obj.class_id.includes('10')) {
	  		gradeLst.push([FontStyle(grade10)])
	  		grade10 = null
	  		k10 += 1
	  	} else {
	  		if (obj.class_id.includes('11')) {
	  			gradeLst.push([FontStyle(grade11)])
	  			grade11 = null
	  			k11 += 1
	  		} else {
	  			gradeLst.push([FontStyle(grade12)])
	  			grade12 = null
	  			k12 += 1
	  		}
	  	} 
	  })

		XLSX.utils.sheet_add_aoa(worksheet, [headerRow1], { origin: "A3" });
	  XLSX.utils.sheet_add_aoa(worksheet, data10, { origin: "A4" });

	  XLSX.utils.sheet_add_aoa(worksheet, [headerRow1], { origin: "A"+(3+k10+1) });
	  XLSX.utils.sheet_add_aoa(worksheet, data11, { origin: "A"+(4+k10+1) });

	  XLSX.utils.sheet_add_aoa(worksheet, [headerRow1], { origin: "A"+(3+k10+1+k11+1) });
	  XLSX.utils.sheet_add_aoa(worksheet, data12, { origin: "A"+(4+k10+1+k11+1) });

	  worksheet["!cols"] = []

	  header.forEach((obj, idx)=>{
	  	worksheet["!cols"].push({ wch: header[idx].length*1.8 });
	  })

	  worksheet["!cols"][0].wch = header[0].length*3
		worksheet["!cols"][7].wpx = 750
	  
	  worksheet["!rows"] = [];
	  worksheet["!rows"][0] = {hpx: 30};
		worksheet["!rows"][2] = {hpx: 40};

	  let merge = [
			{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
			{ s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
		];
		
    if (login.includes('admin')) {
    	let i = 3;
    	for (let j = 3; j <= 3 + k11 + k10 + k12 - 1 + 2; j++) {
    		if(j == (3 + k10) || j == (3 + k10 + k11 + 1)){
    			worksheet["!rows"][j] = {hpx: 40};
    			
    		} else {
		    	worksheet["!rows"][j] = {hpx: 20 * data[i-3][8]}
		    	i++;
    		}
	    }	
    } else {
    	worksheet["!rows"][3] = {hpx: 20 * data[0][8]}
    }

		worksheet["!merges"] = merge;

		XLSX.utils.book_append_sheet(workbook, worksheet, weekin4.week_name);

	  /* create an XLSX file and try to save to Presidents.xlsx */
	  // XLSX.writeFile(workbook, "Presidents.xlsx", { compression: true });
		// const file = documentDirectory + "sheetjsw.xlsx";
		// await writeAsStringAsync(file, wbout, { encoding: "base64" });
		
		const wbout = XLSX.write(workbook, {type:'base64', bookType:"xlsx"});
	  const file = documentDirectory + "Kết quả thi đua "+weekin4.week_name+".xlsx";

	  try {
		  await writeAsStringAsync(file, wbout, {
		    encoding: "base64",
		  });
		  
		  await saveXLSXFile(file);
		  // Alert.alert('Thông báo',"File: 'Kết quả thi đua "+weekin4.week_name+".xlsx' đã được lưu ở thư mục Download trong thiết bị của bạn");
		} catch (e) {
		  
		}
	  // await writeAsStringAsync(file, wbout, { encoding: "base64" });
	  
	  return file;
	}

	// const saveXLSXFile = async (fileUri) => {
  //   const { status } = await MediaLibrary.requestPermissionsAsync();
  //   if (status === "granted") {
  //     const asset = await MediaLibrary.createAssetAsync(fileUri);
  //     await MediaLibrary.createAlbumAsync("../Download", asset, false);
  //   } else Alert.alert('Thông báo',"Chúng tôi cần sự cho phép từ thiết bị của bạn để tải file này về");   
	// };

	const saveXLSXFile = async (fileUri) => {
    const isShare = await Sharing.isAvailableAsync()
    if (isShare) {
      await Sharing.shareAsync(fileUri)  
    }
  }

	const [rootPnt, setRootPnt] = useState(0)
	const [SDBPnt, setSDBPnt] = useState(0)
	const [MSDPnt, setMSDPnt] = useState(0)
	const [MDTPnt, setMDTPnt] = useState(0)
	const [PDTPnt, setPDTPnt] = useState(0)

	const actions = [
    {
      icon: 'calculator',
      label: 'Tính điểm',
      onPress: () => {
				Alert.alert('Thông báo','Bạn có chắc chắn muốn thực hiện hành động này?',[
					{text:'Chắc',onPress:CalculatePoint},
					{text:'Hủy bỏ',style:'cancel'}
				],{cancelable:false})
			},
    },
    { 
    	icon: 'cog', 
    	label: 'Thiết lập mới',
    	onPress: () => {setModal(true);setIniScore({})},
    },
    {
      icon: 'file-export',
      label: 'Lưu file Excel',
      onPress: () => {
				Alert.alert('Thông báo','Bạn có chắc chắn muốn xuất kết quả thành file excel?',[
					{text:'Chắc',onPress:writeWorkbook},
					{text:'Hủy bỏ',style:'cancel'}
				],{cancelable:false})
			},
    },
  ]

	return (
	<PaperProvider>
			<Modal
				animationType='fade'
				transparent={true}
				visible={modal}
			>
				<View style={styles.entireView}>
					<ScrollView style={styles.dialog}>
						<TouchableOpacity 
							onPress={()=>{setModal(false);setIniScore({})}}
							style={{alignSelf:'flex-end'}}
						>
							<MaterialCommunityIcons name='close-circle' size={25} color='gray' />
						</TouchableOpacity>
						<View style={{backgroundColor:'#D0D0D0',marginBottom:10}}>
							<Text style={styles.header}>Thiết lập mới</Text>
						</View>
						<View style={styles.boxName}>
							<Text style={[styles.qsTxt,{marginRight:10}]}>Điểm gốc khối 10</Text>
							<NumericInput  
								value={iniScore.inik10 ? iniScore.inik10 : 0}
								onChange={value => handleInputChange('inik10',value)} 
								rounded
								minValue={0}
							/>
						</View>
						<View style={styles.boxName}>
							<Text style={[styles.qsTxt,{marginRight:10}]}>Điểm gốc khối 11</Text>
							<NumericInput  
								value={iniScore.inik11 ? iniScore.inik11 : 0}
								onChange={value => handleInputChange('inik11',value)} 
								rounded
								minValue={0}
							/>
						</View>
						<View style={styles.boxName}>
							<Text style={[styles.qsTxt,{marginRight:10}]}>Điểm gốc khối 12</Text>
							<NumericInput  
								value={iniScore.inik12 ? iniScore.inik12 : 0}
								onChange={value => handleInputChange('inik12',value)} 
								rounded
								minValue={0}
							/>
						</View>
						
{/*						<View>
							<Text style={[styles.qsTxt,{marginTop:5}]}>Công thức tính điểm:</Text>
							<Text style={{marginVertical:5}}>Điểm tổng = x(Điểm gốc) + x(Điểm SĐB/Số tiết) - x(Điểm trừ SĐ) - x(Điểm trừ ĐT) + x(Điểm cộng ĐT)</Text>
							<View style={{flexDirection:'row'}}>
								<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.1}]}></Text>
								<Text style={[styles.qsTxt,styles.gridTxt2,{fontSize:12,flex:1}]}>{'Điểm\ngốc'}</Text>
								<Text style={[styles.qsTxt,styles.gridTxt2,{fontSize:12,flex:1}]}>{'Điểm SĐB\n/Số tiết'}</Text>
								<Text style={[styles.qsTxt,styles.gridTxt2,{fontSize:12,flex:1}]}>{'Điểm\ntrừ SĐ'}</Text>
								<Text style={[styles.qsTxt,styles.gridTxt2,{fontSize:12,flex:1}]}>{'Điểm\ntrừ ĐT'}</Text>
								<Text style={[styles.qsTxt,styles.gridTxt2,{fontSize:12,flex:1}]}>{'Điểm\ncộng ĐT'}</Text>
							</View>

							<View style={{flexDirection:'row'}}>
								<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.1}]}>x</Text>
								<TextInput 
									value={rootPnt} 
									keyboardType='numeric' 
									style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
									onChangeText={value=>setRootPnt(value.replace(/\s+|,|-|[]/g,''))} 
								/>
								<TextInput 
									value={SDBPnt} 
									keyboardType='numeric' 
									style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
									onChangeText={value=>setSDBPnt(value.replace(/\s+|,|-|[]/g,''))} 
								/>
								<TextInput 
									value={MSDPnt} 
									keyboardType='numeric' 
									style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
									onChangeText={value=>setMSDPnt(value.replace(/\s+|,|-|[]/g,''))} 
								/>
								<TextInput 
									value={MDTPnt} 
									keyboardType='numeric' 
									style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
									onChangeText={value=>setMDTPnt(value.replace(/\s+|,|-|[]/g,''))} 
								/>
								<TextInput 
									value={PDTPnt} 
									keyboardType='numeric' 
									style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}
									onChangeText={value=>setPDTPnt(value.replace(/\s+|,|-|[]/g,''))} 
								/>
							</View>	
						</View>*/}

						<RadioButton.Group  onValueChange={value => setChoice(value)} value={choice}>
				      <RadioButton.Item color='#1FBFF4' label="Áp dụng cho tất cả các tuần" value="all" />
				      <RadioButton.Item color='#1FBFF4' label="Chỉ áp dụng cho tuần hiện tại" value="once" />
				    </RadioButton.Group>
					</ScrollView>
					<View style={{marginHorizontal:20,marginBottom:30}}>
						<Button title='Hoàn thành' onPress={CheckAgain}/>
					</View>
				</View>
			</Modal>
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
				<GradeShow data2={data2} grade={grade} week={week} fnc={false} snackFnc={SnackPopUp}/>
				<View style={{height:50}} />			
			</ScrollView>

			<Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? 'dots-horizontal-circle' : 'dots-horizontal-circle-outline'}
          actions={login.includes('sdl') ? [actions[2]] : actions}
          onStateChange={onStateChange}
        />
      </Portal>

		<Snackbar
      visible={snackView}
      onDismiss={()=>setSnackView(false)}
     >
      {snackMessage}
    </Snackbar>	
	</PaperProvider>
	)
}

export { Xbxh, GradeShow }