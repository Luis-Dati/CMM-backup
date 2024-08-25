import 'intl';
import 'intl/locale-data/jsonp/vi';

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
		weekday: 'long',     // Ngày trong tuần, ví dụ: Thứ Hai
		year: 'numeric',     // Năm, ví dụ: 2023
		month: 'long',       // Tháng, ví dụ: Tháng Tám
		day: 'numeric',      // Ngày trong tháng, ví dụ: 2
	});

	const date = new Date(item);
	return formatter.format(date);
}

function CombineConvert(item){
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

export { ConvertTime, FormatDate, CombineConvert };