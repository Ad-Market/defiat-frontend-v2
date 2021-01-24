import { useCallback, useEffect, useMemo, useState } from "react"
import { useWallet } from "use-wallet"
import { provider } from "web3-core"
import Addresses from "../constants/addresses"
import { BigNumber, getDeFiatContract, getOracle, getPointsContract, getSupplyBurndown, getTokenPrice, viewBurnRate, viewDiscountOf, viewDiscountPointsNeeded, viewFeeRate } from "../defiat"
import { getBalance, getDisplayBalance, getTotalSupply } from "../utils"
import { useBlock } from "./useBlock"
import { useDeFiat } from "./useDeFiat"

interface DashboardData {
  tokenBalance: string;
  tokenSupply:string;
  burnRate:string;
  feeRate:string;
  pointsBalance:string;
  discountLevel:string;
  nextLevel:string;
  tokenPrice:string;
  ethPrice:string;
}


export const useDashboard = () => {
  const {
    account,
    ethereum,
    chainId
  }: { account: string; ethereum: provider, chainId: number } = useWallet()
  const block = useBlock()
  const DeFiat = useDeFiat()

  const [data, setData] = useState<DashboardData>()
  const [events, setEvents] = useState<number[]>()

  const DeFiatContract = useMemo(() => {
    return getDeFiatContract(DeFiat)
  }, [DeFiat]);

  const PointsContract = useMemo(() => {
    return getPointsContract(DeFiat)
  }, [DeFiat]);

  const OracleContract = useMemo(() => getOracle(DeFiat), [DeFiat]);

  const fetchData = useCallback(async () => {
    const values = await Promise.all([
      getBalance(DeFiatContract.options.address, account, ethereum),
      getTotalSupply(DeFiatContract.options.address, ethereum),
      viewBurnRate(DeFiatContract),
      viewFeeRate(DeFiatContract),
      getBalance(PointsContract.options.address, account, ethereum),
      viewDiscountOf(PointsContract, account),
      getTokenPrice(OracleContract, DeFiatContract.options.address),
      getTokenPrice(OracleContract, Addresses.USDT[chainId]),
    ])
    console.log(values[6], values[7])

    const nextLevel = await viewDiscountPointsNeeded(PointsContract, +values[5]+1)

    setData({
      tokenBalance: getDisplayBalance(values[0]),
      tokenSupply: getDisplayBalance(values[1]),
      burnRate: (+values[2] / 100).toFixed(2),
      feeRate: (+values[3] / 100).toFixed(2),
      pointsBalance: getDisplayBalance(values[4]),
      discountLevel: values[5],
      nextLevel: getDisplayBalance(new BigNumber(nextLevel)),
      tokenPrice: getDisplayBalance(new BigNumber(values[7]).multipliedBy(1e18).dividedBy(values[6])),
      ethPrice: getDisplayBalance(new BigNumber(values[7]))
    })
  }, [account, ethereum, DeFiatContract, PointsContract, OracleContract, chainId])

  const fetchEvents = useCallback(async () => {
    const supply = await getSupplyBurndown(DeFiatContract, 0, 0)
    setEvents(supply)
  }, [DeFiatContract])

  useEffect(() => {
    if (!!account && !!DeFiatContract) {
      fetchData();
    }
  }, [account, block, DeFiatContract, fetchData])

  useEffect(() => {
    if (!!account && !!DeFiatContract) {
      fetchEvents();
    }
  }, [account, DeFiatContract, fetchEvents])

  return {
    data,
    events
  }
}