type BannersSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function BannersSearchBar({ value, onChange }: BannersSearchBarProps) {
  return (
    <div className="flex h-12 w-full items-center overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 shadow-ambient transition-shadow duration-200 focus-within:border-primary focus-within:ring-[3px] focus-within:ring-focus-ring">
      <span
        aria-hidden="true"
        className="material-symbols-outlined mr-3 shrink-0 text-on-surface-variant"
      >
        search
      </span>
      <input
        className="h-full w-full bg-transparent font-body text-base text-on-surface outline-none placeholder:text-on-surface-variant focus:ring-0"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search banners by name, status, or order..."
        type="search"
        value={value}
      />
    </div>
  );
}
