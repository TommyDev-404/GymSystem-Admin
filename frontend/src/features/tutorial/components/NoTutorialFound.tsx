import { SearchX } from "lucide-react";

export function NoTutorialFound() {
	return (
		<div className="col-span-full flex h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50 dark:bg-stone-900/50 px-6 text-center">
			<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-stone-700">
				<SearchX className="h-7 w-7 text-muted-foreground" />
			</div>

			<h3 className="text-lg font-semibold">
				No tutorials found
			</h3>

			<p className="mt-2 max-w-sm text-sm text-muted-foreground">
				There are no tutorials to display. Try adjusting your search or filters, or add a new tutorial.
			</p>
		</div>
	);
}