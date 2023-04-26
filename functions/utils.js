import { Contract, BigNumber } from 'ethers'
import { constants } from '../constants.js'
import { default as xenABI } from '../abi/xenABI.json' assert { type: 'json' }
import { default as disperseABI } from '../abi/disperseABI.json' assert { type: 'json' }

const { xenContractAddress, disperseContractAddress } = constants

export const estimateClaimRankGas = async (provider, days) => {
	let contract = new Contract(xenContractAddress, xenABI, provider)
	let res = await contract.estimateGas.claimRank(BigNumber.from(days))
	let estimatedGasUnits = res.toNumber()
	console.log(estimatedGasUnits)
}

// disperse
export const disperseEth = async (addresses, amounts, sponsor) => {
	try {
		let contract = new Contract(disperseContractAddress, disperseABI, sponsor)
		let total = amounts.reduce(
			(acc, cur) => acc.add(cur),
			BigNumber.from(0)
		)
		let { gasPrice } = await sponsor.getFeeData()

		let receipt = await contract.disperseEther(addresses, amounts, {
			value: total,
			gasPrice,
		})
		return receipt
	} catch (error) {
		console.log(error)
	}
}
