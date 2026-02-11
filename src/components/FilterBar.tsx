import { Search, Filter } from "lucide-react";
import { AgentCategory } from "@/lib/types";
import { getCategoryLabel } from "@/lib/colors";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string | null;
  onCategoryChange: (c: string | null) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
}

const categories: AgentCategory[] = [
  "researcher", "creator", "trader", "validator", "explorer",
];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
}: Props) {
  return (
    <div className="glass rounded-lg p-3 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar agentes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-secondary/50 text-foreground text-sm rounded-md pl-9 pr-3 py-2 outline-none border border-border focus:border-primary transition-colors placeholder:text-muted-foreground"
        />
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Filter size={14} className="text-muted-foreground" />
        <button
          onClick={() => onCategoryChange(null)}
          className={`text-xs px-3 py-1.5 rounded-full transition-all ${
            !categoryFilter
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(categoryFilter === cat ? null : cat)}
            className={`text-xs px-3 py-1.5 rounded-full transition-all ${
              categoryFilter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="text-xs bg-secondary text-secondary-foreground rounded-md px-3 py-2 border border-border outline-none focus:border-primary"
      >
        <option value="rank">Ranking</option>
        <option value="balance">Saldo</option>
        <option value="name">Nombre</option>
      </select>
    </div>
  );
}
