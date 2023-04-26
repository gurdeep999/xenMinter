import fs from 'fs'
import fspromises from 'fs/promises'

export const generateMnemonic = (Wallet) => {
	let wallet = new Wallet.createRandom()
	let mnemonic = wallet.mnemonic.phrase
	return mnemonic
}

export const generateWalletsWithMnemonic = (Wallet, mnemonic, amount) => {
	let wallets = Array.from(
		Array(amount),
		(_, i) => new Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${i}`)
	)
	return wallets
}


export const writeDataTxt = async (data) => {
	let path = 'creds.txt'
	const writeStream = fs.createWriteStream(path, { flags: 'a' })
	// if (!fs.existsSync(path)) {
		// 	writeStream.write('some header')
		// }
		writeStream.write(data)
		writeStream.end('\n')
	}
	
	export const writeAllGeneratedKeys = async (data) => {
		let path = 'keydump.txt'
		const writeStream = fs.createWriteStream(path, { flags: 'a' })
		// if (!fs.existsSync(path)) {
			// 	writeStream.write('some header')
			// }
	writeStream.write(data)
	writeStream.end('\n')
}

export const readTxt = () => {
	const data = fs.readFileSync('./creds.txt', 'utf-8')
	console.log(data)
}

export const generateWallets = (Wallet, amount) => {
	let wallets = Array.from(Array(amount), () => new Wallet.createRandom())
	let privateKeys = wallets.map(w => w.privateKey).join("\n")
	writeAllGeneratedKeys(privateKeys)
	return wallets
}