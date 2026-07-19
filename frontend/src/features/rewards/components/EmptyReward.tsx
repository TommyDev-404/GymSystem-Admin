import { Gift } from "lucide-react";

export function EmptyReward() {
	return (
		<div className="col-span-full flex h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50 px-6 text-center">
			<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
				<Gift className="h-7 w-7 text-emerald-500" />
			</div>

			<h3 className="text-base font-semibold text-slate-700">
				No rewards available
			</h3>

			<p className="mt-2 max-w-sm text-sm text-slate-500">
				There are currently no rewards to claim. Check back later for new offers and benefits.
			</p>
		</div>
	);
}