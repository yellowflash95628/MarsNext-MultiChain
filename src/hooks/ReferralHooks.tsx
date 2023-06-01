import {
  AddressZero,
  ReferralV1ContractObject,
} from '@/constants/ContractAddress';
import { useSupportedNetworkInfo } from '@/constants/SupportedNetworkInfo';
import { formatNumberWithMaxDecimals } from '@/util/UtilHooks';
import { id } from 'ethers/lib/utils';
import { formatEther } from 'viem';
import { useContractRead, useNetwork } from 'wagmi';

export const useContractCall = ({
  functionName,
  args,
}: {
  functionName: string;
  args?: any[];
}) => {
  const { chain } = useNetwork();
  const currentNetwork = useSupportedNetworkInfo[chain?.id ?? 137];

  const { data, isError, isLoading, error } = useContractRead({
    address: currentNetwork?.referralContractAddress,
    abi: ReferralV1ContractObject?.abi,
    functionName: functionName,
    args: args ?? [],
  });

  if (isError) {
    console.log('Referral Hook Error', error?.message);
    return undefined;
  }

  return data;
};

export type PlanInfoType = {
  name: string;
  value: number;
  maxLimitMutiplier: number;
};
export const useReferralPlanInfo = (planId: number): PlanInfoType => {
  return { name: 'Beginner', value: 10, maxLimitMutiplier: 3 };
};

export const useGetUserLimits = (userAddress: `0x${string}` | undefined) => {
  const value = useContractCall({
    functionName: 'getUserLimit',
    args: [userAddress],
  });

  const valueObject = {
    maxLimit: value
      ? formatNumberWithMaxDecimals(Number(value[0]) / 10 ** 18, 3)
      : 0,
    currentLimit: value
      ? formatNumberWithMaxDecimals(Number(value[1]) / 10 ** 18, 3)
      : 0,
    limitRemaingvalue: value
      ? formatNumberWithMaxDecimals(Number(value[2]) / 10 ** 18, 3)
      : 0,
  };

  return valueObject;
};

export const useGetUserBusiness = (userAddress: `0x${string}` | undefined) => {
  const value = useContractCall({
    functionName: 'getUserBusiness',
    args: [userAddress],
  });

  const valueObject = {
    selfBusiness: value
      ? formatNumberWithMaxDecimals(Number(value[0]) / 10 ** 18, 3)
      : 0,
    directBusiness: value
      ? formatNumberWithMaxDecimals(Number(value[1]) / 10 ** 18, 3)
      : 0,
    teamBusiness: value
      ? formatNumberWithMaxDecimals(Number(value[2]) / 10 ** 18, 3)
      : 0,
    totalBusiness: value
      ? formatNumberWithMaxDecimals(Number(value[3]) / 10 ** 18, 3)
      : 0,
  };

  return valueObject;
};

export const useGetUserRewards = (userAddress: `0x${string}` | undefined) => {
  const value = useContractCall({
    functionName: 'getUserRewards',
    args: [userAddress],
  });

  const valueObject = {
    referralReward: value
      ? formatNumberWithMaxDecimals(Number(value[0]) / 10 ** 18, 3)
      : 0,
    globalReward: value
      ? formatNumberWithMaxDecimals(Number(value[1]) / 10 ** 18, 3)
      : 0,
    weeklyReward: value
      ? formatNumberWithMaxDecimals(Number(value[2]) / 10 ** 18, 3)
      : 0,
    ibpReward: value
      ? formatNumberWithMaxDecimals(Number(value[3]) / 10 ** 18, 3)
      : 0,
    totalIncome: value
      ? formatNumberWithMaxDecimals(Number(value[4]) / 10 ** 18, 3)
      : 0,
  };

  return valueObject;
};

export const useGetUserTeam = (
  userAddress: `0x${string}` | undefined
): {
  referrer: `0x${string}`;
  referees: [] | `0x${string}`[];
  refereeCount: number;
  team: [] | `0x${string}`[];
  teamLevels: [] | number[];
  teamCount: number;
} => {
  const value = useContractCall({
    functionName: 'getUserTeam',
    args: [userAddress],
  });

  const valueObject = {
    referrer: value ? value[0] : AddressZero,
    referees: value ? value[1] : [],
    refereeCount: value ? Number(value[2]) : 0,
    team: value ? value[3] : [],
    teamLevels: value ? value[4] : [],
    teamCount: value ? Number(value[5]) : 0,
  };

  return valueObject;
};
