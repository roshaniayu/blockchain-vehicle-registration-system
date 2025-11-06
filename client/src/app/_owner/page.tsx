"use client";

import VehiclePage from "../vehicles/page";

// Components
import { MyInfo } from "./components/MyInfo";

export default function OwnerPage() {
  return (
    <div className="h-full">
      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-8">
          <VehiclePage className="2xl:grid-cols-2!" />
        </div>
        <div className="col-span-4 p-8 h-full">
          <MyInfo />
        </div>
      </div>
    </div>
  );
}
