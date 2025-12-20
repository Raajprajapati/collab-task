import { Input } from "./ui/Input";
import { Priority, Status, type FilterTasks, type User } from "../types";
import { Button } from "./ui/Button";


interface TaskFiltersProps {
    filterState: FilterTasks;
    setFilterState: React.Dispatch<React.SetStateAction<FilterTasks>>;
    clearFilters: () => void;
    users: User[];
}
const TaskFilters = ({ filterState, setFilterState, clearFilters, users }: TaskFiltersProps) => {


    const renderFilterInput = () => {
        switch (filterState.filterBy) {
            case 'status':
                return (
                    <select
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={filterState.filterValue}
                        onChange={(e) => setFilterState((prev: FilterTasks) => ({ ...prev, filterValue: e.target.value }))}
                    >
                        <option value="">Select Status</option>
                        {Object.values(Status).map((s) => (
                            <option key={s} value={s}>
                                {s.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                );
            case 'priority':
                return (
                    <select
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={filterState.filterValue}
                        onChange={(e) => setFilterState((prev: FilterTasks) => ({ ...prev, filterValue: e.target.value }))}
                    >
                        <option value="">Select Priority</option>
                        {Object.values(Priority).map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                );
            case 'assignedToId':
            case 'creatorId':
                return (
                    <select
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={filterState.filterValue}
                        onChange={(e) => setFilterState((prev: FilterTasks) => ({ ...prev, filterValue: e.target.value }))}
                    >
                        <option value="">Select User</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} ({u.email})
                            </option>
                        ))}
                    </select>
                );
            case 'overdue':
                return (
                    <div className="flex items-center h-[38px]">
                        <input
                            type="checkbox"
                            checked={filterState.filterValue === 'true'}
                            onChange={(e) => setFilterState((prev: FilterTasks) => ({ ...prev, filterValue: e.target.checked ? 'true' : '' }))}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Is Overdue</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Search, Filter, Sort Controls */}
            <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <Input
                            label="Search"
                            type="text"
                            placeholder="Search tasks..."
                            value={filterState.search || ''}
                            onChange={(e) => setFilterState((prev: FilterTasks) => ({ ...prev, search: e.target.value }))}
                        />
                    </div>

                    {/* Sort */}
                    <div className="flex-1">
                        <label>Sort By</label>
                        <div className="flex gap-2">

                            <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={filterState.orderBy}
                                onChange={(e) => setFilterState((prev: FilterTasks) => ({ ...prev, orderBy: e.target.value as any }))}
                            >
                                <option value="createdAt">Created Date</option>
                                <option value="dueDate">Due Date</option>
                            </select>
                            <select
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={filterState.order}
                                onChange={(e) => setFilterState((prev: FilterTasks) => ({ ...prev, order: e.target.value as any }))}
                            >
                                <option value="desc">Newest First</option>
                                <option value="asc">Oldest First</option>
                            </select>
                        </div>
                    </div>

                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-end gap-2">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500">Filter By</label>
                        <select
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={filterState.filterBy}
                            onChange={(e) => {
                                setFilterState((prev: FilterTasks) => ({ ...prev, filterBy: e.target.value as any, filterValue: '' }));
                            }}
                        >
                            <option value="status">Status</option>
                            <option value="priority">Priority</option>
                            <option value="assignedToId">Assigned To</option>
                            <option value="creatorId">Created By</option>
                            <option value="overdue">Overdue?</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        {filterState.filterBy !== 'overdue' && <label className="text-xs font-medium text-gray-500">Value</label>}
                        {renderFilterInput()}
                    </div>
                    {(filterState.filterValue !== '' || filterState.search !== '') && <Button variant="secondary" onClick={clearFilters} className="mb-[1px]">
                        Clear Filter
                    </Button>}
                </div>
            </div>
        </>
    )
}

export default TaskFilters;
