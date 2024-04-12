var CryptoES = require("crypto-js");
// import CryptoES from 'crypto-es'
function EncryptPass (pass, key) {
	return CryptoES.AES.encrypt(pass, key).toString();	
}

function DecryptPass (code, key) {
	let bytes = CryptoES.AES.decrypt(code, key);
	return bytes.toString(CryptoES.enc.Utf8);
}
const mypass = 'THPTDT@adm10'
const mycode = EncryptPass(mypass, 'admin10') 
//console.log(mycode)
console.log(DecryptPass('U2FsdGVkX1/bzWXVCT/KHWwr6ZaX8yP1wAIndpj056A=', 'admin11'))
console.log(EncryptPass('THPTDT@adm11','admin11'))
// export { EncryptPass, DecryptPass }