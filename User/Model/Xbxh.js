import React, { useState, useEffect } from 'react';
import { TextInput, RefreshControl, FlatList, Alert, Button, SectionList, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { TextInput } from 'react-native-paper';
import { SimpleGrid } from 'react-native-super-grid';
import SwitchSelector from "react-native-switch-selector";
import { useNavigation } from '@react-navigation/native';
import NumericInput from 'react-native-numeric-input';
import { RadioButton, Divider, Menu, PaperProvider, Snackbar } from 'react-native-paper';
// import XLSX from 'xlsx';
import XLSX from 'xlsx-js-style'
import { documentDirectory, writeAsStringAsync, readAsStringAsync } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import styles from './styles';
import DATA_URL from '../../url.js'

const GradeShow = ({ navigation, data2, grade, week, fnc, snackFnc}) => {
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
console.log(data2)
	let lst = null
	
	const bMap = new Map();

	if (data2) {
		lst = data2.filter(obj => obj.class_id.class_id.includes(grade)).sort((a, b)=>(b.score-a.score))	
	}

	const onPress = (classId, className) => {			
		navigation.push("Main",{classId:classId,className:className,weekSpec:week})
	}

	return (
		// <ScrollView>
		// 	{lst != null
		// 	?	(
		// 			<View>
		// 				<Text style={styles.sectionHeader}>Tuần {week.slice(2)}</Text>
		// 				<View style={{flexDirection:'row'}}>
		// 					<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.8}]}>Thứ hạng</Text>
		// 					<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Tên lớp</Text>
		// 					<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Điểm số</Text>
		// 				</View>
						
		// 	      {lst.map((item,index)=>(
		// 					<TouchableOpacity style={{flexDirection:'row'}} onPress={fnc ? () => onPress(item.class_id?.class_id, item.class_id?.class_name) : ()=>{}}>
		// 						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.8}]}>{index+1}</Text>
		// 						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.class_id?.class_name}</Text>
		// 						<Text style={[styles.gridTxt2,{flex:1}]}>{item.score}</Text>	
		// 					</TouchableOpacity>
		// 				))}
		// 			</View>
		// 		)
		// 	: (
		// 			<View style={{marginTop:30,justifyContent:'center',alignItems:'center'}}>
		// 				<ActivityIndicator size="large" />
		// 			</View>
		// 		)
		// 	}	
		// </ScrollView>
		<View>
			<FlatList
				refreshControl={
	        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
	      }
				ListHeaderComponent={
					<View>
						<Text style={styles.sectionHeader}>Tuần {week.slice(2)}</Text>
						<View style={{flexDirection:'row'}}>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.8}]}>Thứ hạng</Text>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Tên lớp</Text>
							<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>Điểm số</Text>
						</View>
					</View>
				}
	      data={lst}
	      renderItem={({item, index}) => (
	      	<TouchableOpacity style={{flexDirection:'row'}} onPress={fnc ? () => onPress(item.class_id?.class_id, item.class_id?.class_name) : ()=> {setModal(true);setKlass(item.class_id)}}>
						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.8}]}>{index+1}</Text>
						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{item.class_id?.class_name}</Text>
						<Text style={[styles.gridTxt2,{flex:1}]}>{item.score}</Text>	
					</TouchableOpacity>
	      )}
	      keyExtractor={(item, idx) => JSON.stringify(item.class_id)}
	      // ListFooterComponent={
	    	// 	<View style={{height:50}} />  	
	      // }
	      ListEmptyComponent={
	      	<View style={{marginTop:30,justifyContent:'center',alignItems:'center'}}>
		 				<ActivityIndicator size="large" />
		 			</View>
	      }
	    />

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
    </View>
	)
}

const Xbxh = ({ week, weekin4, login, loginIn4 }) => {
	const navigation = useNavigation();

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
      const response = await fetch(DATA_URL+'score/'+week);
      const jsonData = await response.json();
      setScoreList(jsonData);
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

  const fetchVpmList = async () => {
    try {
      const response = await fetch(DATA_URL+'vipham/'+week);
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

	async function CalculatePoint() {
		await TinhDiem2(data3)
		SnackPopUp('Đã tính điểm xong')
		setSignal('Complete! '+new Date().toString())

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

		        await SendScore({ week_id: objScore.week_id, class_id: objScore.class_id, score: (iniMinus*0.2 + (result/cnt)*10*0.8)});
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
		    },
		    body: JSON.stringify(param),
		  });
		}

		await CalculateSomeData()
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

 	async function CalculateSomeData() {
 		SnackPopUp('Hãy chờ một chút trong khi hệ thống chuẩn bị dữ liệu')
 		let temp = [], result = [];

		async function SendNote(param) {
			const response = await fetch(DATA_URL+'scorenote', {
		    method: 'PUT',
		    headers: {
		      'Content-Type': 'application/json',
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

			if (login.includes('sdl')) {
				temp = [ temp.find((item) => login.includes((item.class.slice(3)))) ]
			}

			let noteList = []

	 		result = temp.map(async item => { //Lặp qua từng lớp
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
		 		noteList.push({note:item.note,class_id:item.class,week_id:weekin4.week_id})
		 		
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

	 		console.log(noteList)
	 		noteList.map(async (item) => {
	 			await SendNote(item)
	 		})
	 	}

 		return result
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
		    },
		    body: JSON.stringify(param),
		  });
		}

	}

	// xuất xlsx
	async function writeWorkbook(wb) {
		let data = await CalculateSomeData()._z
		
	  /* generate worksheet and workbook */
		let MainRow = [
			{ v: 'KẾT QUẢ THI ĐUA TUẦN ' + week.slice(2), t: "s", 
				s: { 
					font: { name: "Times New Roman", sz: 13, bold: true, color: { rgb: "FF0000" } },
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

	  const header = ["KHỐI", "LỚP", `ĐIỂM\nSĐB`, 'SỐ TIẾT', `ĐIỂM\nTRỪ`, 'ĐIỂM\nCỘNG' ,"TỔNG ĐIỂM", "XẾP HẠNG", "GHI CHÚ"]
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
		XLSX.utils.sheet_add_aoa(worksheet, gradeLst, { origin: "A4" });
	  /* calculate column width */
	  XLSX.utils.sheet_add_aoa(worksheet, data, { origin: "B4" });

	  worksheet["!cols"] = []

	  header.forEach((obj, idx)=>{
	  	worksheet["!cols"].push({ wch: header[idx].length*1.8 });
	  })

	  worksheet["!cols"][0].wch = header[0].length*3
	  worksheet["!cols"][1].wch = header[1].length*3

		worksheet["!cols"][8].wpx = 760
	  
	  worksheet["!rows"] = [];

		worksheet["!rows"][2] = {hpx: 40};

	  let merge = [
			{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
			{ s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
		];

		if (k10 > 0) {merge.push({ s: { r: 3, c: 0 }, e: { r: 3 + k10 - 1, c: 0 } })}
		if (k11 > 0) {merge.push({ s: { r: 3 + k10, c: 0 }, e: { r: 3 + k11 + k10 - 1, c: 0 } })}
    if (k12 > 0) {merge.push({ s: { r: 3 + k11 + k10, c: 0 }, e: { r: 3 + k11 + k10 + k12 - 1, c: 0 } })}
		
    if (login == 'admin') {
    	for (let i = 3; i <= 3 + k11 + k10 + k12 - 1; i++) {
	    	worksheet["!rows"][i] = {hpx: 20 * data[i-3][8]}
	    }	
    } else {
    	worksheet["!rows"][3] = {hpx: 20 * data[0][8]}
    }

    

		worksheet["!merges"] = merge;

		XLSX.utils.book_append_sheet(workbook, worksheet, "Kết quả");

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

	function FormatDate(item){
		const formatter = new Intl.DateTimeFormat('vi-VN', {
			year: 'numeric',     // Năm, ví dụ: 2023
			month: 'long',       // Tháng, ví dụ: Tháng Tám
			day: 'numeric',      // Ngày trong tháng, ví dụ: 2
		});

		const date = ConvertTime(item)
		return formatter.format(date);
	}

	const [view, setView] = useState('none')
	const [rootPnt, setRootPnt] = useState(0)
	const [SDBPnt, setSDBPnt] = useState(0)
	const [MSDPnt, setMSDPnt] = useState(0)
	const [MDTPnt, setMDTPnt] = useState(0)
	const [PDTPnt, setPDTPnt] = useState(0)

	return (
	<PaperProvider>
		<View style={styles.container}>
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
				      <RadioButton.Item color='blue' label="Áp dụng cho tất cả các tuần" value="all" />
				      <RadioButton.Item color='blue' label="Chỉ áp dụng cho tuần hiện tại" value="once" />
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
			  textColor='blue'
			  selectedColor='#fff'
			  buttonColor='blue'
			  borderColor='blue'
			  hasPadding
			  options={options}
			  testID="gender-switch-selector"
				accessibilityLabel="gender-switch-selector"
			/>
			<GradeShow data2={data2} grade={grade} week={week} fnc={false} snackFnc={SnackPopUp}/>
		
			{login.includes('sdl')
			? (
					<View style={{position:'absolute',bottom:50,left:5,borderRadius:10}}>
						<Button title={`Lưu thành\nfile excel`} color='green' onPress={()=>{
							Alert.alert('Thông báo','Bạn có chắc chắn muốn xuất kết quả thành file excel?',[
								{text:'Chắc',onPress:writeWorkbook},
								{text:'Hủy bỏ',style:'cancel'}
							],{cancelable:false})
						}} />
					</View>
				)
			: (
					<View style={{position:'absolute',bottom:50,left:0,borderRadius:10}}>
						<View style={{display:view}}>
							<Button title='Thiết lập mới' color='gray' onPress={()=>{setModal(true);setIniScore({})}} />
							<Divider bold={true}/>
							<Button title='Lưu thành file excel' color='gray' onPress={()=>{
								Alert.alert('Thông báo','Bạn có chắc chắn muốn xuất kết quả thành file excel?',[
									{text:'Chắc',onPress:writeWorkbook},
									{text:'Hủy bỏ',style:'cancel'}
								],{cancelable:false})
							}} />
							<Divider bold={true}/>
							<Button title='Tính điểm thủ công' color='gray' onPress={()=>{
								Alert.alert('Thông báo','Bạn có chắc chắn muốn thực hiện hành động này?',[
									{text:'Chắc',onPress:CalculatePoint},
									{text:'Hủy bỏ',style:'cancel'}
								],{cancelable:false})
							}} />
						</View>

		        <TouchableOpacity onDismiss={()=>setView('none')} onPress={()=>{setVisible(true); setView(view == 'flex' ? 'none' : 'flex')}}>
							<MaterialCommunityIcons name='dots-horizontal-circle' color='green' size={50} />
						</TouchableOpacity>

					</View>
				)
			}		

		</View>
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