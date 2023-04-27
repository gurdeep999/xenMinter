import { ethers, Wallet, utils, providers, Contract, BigNumber } from 'ethers'
import { generateWallets, writeDataTxt } from './utils.js'
import { constants } from './constants.js'
import Bluebird from 'bluebird'
import { disperseEth } from './functions/utils.js'
import { xenClaimRank } from './functions/xen.js'

const { rpc, sponsorPrivateKey } = constants
const provider = new providers.JsonRpcProvider(rpc)

const manualGasLimit = 165000			// you can play around with this. It takes around 160k gas units to claimRank. Any less it will fail/revert
const amountOWalletsToClaimFrom = 100 	// Example 10  (make sure you have enough funds)
const term = 365  						// term days after which you will be able to claim your tokens
 
const xenMultiClaimRank = async (amountOfWallets, term, provider) => {
	let wallets = generateWallets(Wallet, amountOfWallets)
	let walletsWithProvider = wallets.map((w) => w.connect(provider))
	let sponsorWallet = new Wallet(sponsorPrivateKey, provider)        // funds will be dispersed from sponsor to generated wallets
	
	let { gasPrice } = await provider.getFeeData()
	let gasRequired = gasPrice.mul(BigNumber.from(manualGasLimit))

	// dispersing funds
	let disperseRes = await disperseEth(
		wallets.map((w) => w.address),
		Array(amountOfWallets).fill(gasRequired),
		sponsorWallet
	)

	await disperseRes.wait()

	let claimReceipts = await Bluebird.map(
		walletsWithProvider,
		async (wallet) => {
			let receipt = await xenClaimRank(
				wallet,
				term,
				manualGasLimit,
				gasPrice
			)
			return receipt
		},
		{ concurrency: 5 }   // high concurrency -> faster -> more likely to spike gas prices  (optimal range: 3-5)
	)

	let privateKeys = []

	// checks if the txs have gone through
	await Bluebird.map(
		claimReceipts,
		async (receipt, index) => {
			await receipt.wait()
			privateKeys.push(wallets[index].privateKey)
		},
		{ concurrency: 10 }
	)

	// writes the private keys into creds.txt
	writeDataTxt(privateKeys.join('\n'))
}


// (wallets, days)
xenMultiClaimRank(amountOWalletsToClaimFrom, term, provider)

/*
	Goals: 
		generate wallet
		estimate mint gas fees
		disperse gas from feeder
		mint from generated wallets
		2. claim and send to one wallet
		make it an executable
*/
