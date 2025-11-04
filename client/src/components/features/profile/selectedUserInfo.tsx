import { Wallet_Icon } from "@/components/icons/iconPack";
import { shortenString } from "@/helpers/converts";
import { UserInfo_T } from "@/types/owner";

export default function SelectedUserInfo(props: { dataset?: UserInfo_T }) {
  const { dataset } = props;

  if (!dataset) return null;

  return (
    <div className="bg-black/30 p-4 pb-12 mb-8 rounded-xl">
      <h1 className="font-bold my-4 text-gray-400"> Owner Information </h1>
      <div className="gap-4 text-gray-400 text-[14px]">
        <div className="relative mt-4 flex gap-2 z-0 w-full group">
          ID:
          <span className="text-gray-100 font-bold">
            {shortenString(dataset.OwnerID ?? "N/A")}
          </span>
        </div>

        <div className="relative mt-4 flex gap-2 z-0 w-full group">
          Full Name:
          <span className="text-gray-100 font-bold">
            {dataset.Name ?? "N/A"}
          </span>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative mt-4 flex gap-2 z-0 w-full group">
            Driving Licnese:
            <span className="text-gray-100 font-bold">
              {dataset.LicenseID ?? "N/A"}
            </span>
          </div>
          <div className="relative mt-4 flex gap-2 z-0 w-full group">
            <Wallet_Icon />
            <span className="text-gray-100 font-bold">
              {shortenString(dataset.WalletAddress ?? "N/A")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
