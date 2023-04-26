import { default as xenABI } from '../abi/xenABI.json' assert { type: 'json' }
import { Contract, BigNumber } from 'ethers'
import { constants } from '../constants.js'

const { xenContractAddress } = constants

export const xenClaimRank = async (wallet, days, gasLimit, gasPrice) => {
	let contract = new Contract(xenContractAddress, xenABI, wallet)
	let receipt = await contract.claimRank(BigNumber.from(days), {
		gasLimit,
		gasPrice,
	})
	return receipt
}
