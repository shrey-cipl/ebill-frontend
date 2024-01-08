import TelephoneNumber from './TelephoneNumber';
import MovementEntry from './MovementEntry';
import FormerInfo from './FormerInfo';

type ReimbursementRecord = {
  PFMS: string;
  billProcessingStartDate: string;
  billType: string;
  claimPeriodFrom: string;
  claimPeriodTo: string;
  claimReceivingDate: string;
  createdAt: string;
  currentStatus: string;
  currentRemark: string;
  diaryNumber: string;
  fileNumber: string;
  former: FormerInfo;
  lastForwardedBy: string;
  lastForwardedTo: string;
  maxAdmissibleAmount: number;
  movement: MovementEntry[];
  name: string;
  pendingBranch: string;
  telephoneNumbers: TelephoneNumber[];
  totalAdmissibleAmount: number;
  sanctionedAmount: number;
  totalClaimedAmount: number;
  currentremark:string,
  updatedAt: string;
  email:string;
  phone:string;
  __v: number;
  _id: string;
};

export default ReimbursementRecord;
